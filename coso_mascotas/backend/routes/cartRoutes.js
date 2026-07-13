const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

async function cartId(client, userId) {
  const result = await client.query(
    "INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at=NOW() RETURNING id",
    [userId],
  );
  return result.rows[0].id;
}

async function readCart(userId) {
  const result = await pool.query(
    `SELECT ci.product_id AS "productId", ci.quantity AS qty
       FROM carts c JOIN cart_items ci ON ci.cart_id=c.id
      WHERE c.user_id=$1 ORDER BY ci.created_at`,
    [userId],
  );
  return result.rows.map((row) => ({ productId: Number(row.productId), qty: Number(row.qty) }));
}

function quantity(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) throw httpError(400, "La cantidad debe estar entre 1 y 99.");
  return parsed;
}

router.get("/", asyncHandler(async (req, res) => res.json(await readCart(req.user.id))));

router.put("/:productId", asyncHandler(async (req, res) => {
  const qty = quantity(req.body.quantity ?? req.body.qty);
  const product = await pool.query("SELECT stock FROM products WHERE id=$1 AND status='Activo'", [req.params.productId]);
  if (!product.rows[0]) throw httpError(404, "Producto no encontrado.");
  if (qty > Number(product.rows[0].stock)) throw httpError(409, "No hay stock suficiente para esa cantidad.");
  const id = await cartId(pool, req.user.id);
  await pool.query(
    `INSERT INTO cart_items (cart_id,product_id,quantity) VALUES ($1,$2,$3)
     ON CONFLICT (cart_id,product_id) DO UPDATE SET quantity=EXCLUDED.quantity,updated_at=NOW()`,
    [id, req.params.productId, qty],
  );
  res.json(await readCart(req.user.id));
}));

router.delete("/:productId", asyncHandler(async (req, res) => {
  await pool.query(
    "DELETE FROM cart_items WHERE cart_id=(SELECT id FROM carts WHERE user_id=$1) AND product_id=$2",
    [req.user.id, req.params.productId],
  );
  res.status(204).end();
}));

router.post("/sync", asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const id = await cartId(client, req.user.id);
    for (const item of items) {
      const qty = quantity(item.qty ?? item.quantity);
      const product = await client.query("SELECT stock FROM products WHERE id=$1 AND status='Activo'", [item.productId]);
      if (!product.rows[0] || Number(product.rows[0].stock) < qty) continue;
      await client.query(
        `INSERT INTO cart_items (cart_id,product_id,quantity) VALUES ($1,$2,$3)
         ON CONFLICT (cart_id,product_id) DO UPDATE SET quantity=GREATEST(cart_items.quantity,EXCLUDED.quantity),updated_at=NOW()`,
        [id, item.productId, qty],
      );
    }
    await client.query("COMMIT");
    res.json(await readCart(req.user.id));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}));

module.exports = router;
