const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT o.id,o.status,o.total,o.shipping_cost AS "shippingCost",o.created_at AS "createdAt",
            COALESCE(JSON_AGG(JSON_BUILD_OBJECT('name',oi.product_name,'price',oi.unit_price,'quantity',oi.quantity))
              FILTER (WHERE oi.id IS NOT NULL),'[]') AS items
       FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id
      WHERE o.user_id=$1 GROUP BY o.id ORDER BY o.created_at DESC`,
    [req.user.id],
  );
  res.json(result.rows.map((row) => ({ ...row, id: Number(row.id), total: Number(row.total), shippingCost: Number(row.shippingCost) })));
}));

router.post("/", asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const itemsResult = await client.query(
      `SELECT p.id,p.name,p.price,p.stock,p.status,ci.quantity
         FROM carts c
         JOIN cart_items ci ON ci.cart_id=c.id
         JOIN products p ON p.id=ci.product_id
        WHERE c.user_id=$1
        ORDER BY p.id
        FOR UPDATE OF p`,
      [req.user.id],
    );
    if (itemsResult.rows.length === 0) throw httpError(400, "El carrito está vacío.");

    for (const item of itemsResult.rows) {
      if (item.status !== "Activo" || Number(item.stock) < Number(item.quantity)) {
        throw httpError(409, `No hay stock suficiente de ${item.name}.`, "INSUFFICIENT_STOCK");
      }
    }

    const subtotal = itemsResult.rows.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const settingsResult = await client.query(
      "SELECT key,value FROM site_settings WHERE key IN ('free_shipping_minimum','standard_shipping_cost')",
    );
    const settings = Object.fromEntries(settingsResult.rows.map((row) => [row.key, Number(row.value)]));
    const freeShippingMinimum = settings.free_shipping_minimum ?? 50000;
    const standardShippingCost = settings.standard_shipping_cost ?? 4500;
    const shippingCost = subtotal >= freeShippingMinimum ? 0 : standardShippingCost;
    const total = subtotal + shippingCost;
    const orderResult = await client.query(
      "INSERT INTO orders (user_id,total,shipping_cost) VALUES ($1,$2,$3) RETURNING id,status,total,shipping_cost AS \"shippingCost\",created_at AS \"createdAt\"",
      [req.user.id, total, shippingCost],
    );
    const order = orderResult.rows[0];

    for (const item of itemsResult.rows) {
      const subtotal = Number(item.price) * Number(item.quantity);
      await client.query(
        `INSERT INTO order_items (order_id,product_id,product_name,unit_price,quantity,subtotal)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, item.id, item.name, item.price, item.quantity, subtotal],
      );
      await client.query("UPDATE products SET stock=stock-$1 WHERE id=$2", [item.quantity, item.id]);
      await client.query(
        "INSERT INTO inventory_movements (product_id,order_id,user_id,quantity_change,reason) VALUES ($1,$2,$3,$4,'Venta')",
        [item.id, order.id, req.user.id, -Number(item.quantity)],
      );
    }

    await client.query("DELETE FROM cart_items WHERE cart_id=(SELECT id FROM carts WHERE user_id=$1)", [req.user.id]);
    await client.query("COMMIT");
    res.status(201).json({
      ...order,
      id: Number(order.id),
      total: Number(order.total),
      shippingCost: Number(order.shippingCost),
      items: itemsResult.rows.map((item) => ({ productId: Number(item.id), name: item.name, quantity: Number(item.quantity), price: Number(item.price) })),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}));

module.exports = router;
