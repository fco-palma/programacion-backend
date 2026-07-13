const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT product_id FROM favorites WHERE user_id=$1 ORDER BY created_at", [req.user.id]);
  res.json(result.rows.map((row) => Number(row.product_id)));
}));

router.post("/:productId", asyncHandler(async (req, res) => {
  const product = await pool.query("SELECT id FROM products WHERE id=$1 AND status='Activo'", [req.params.productId]);
  if (!product.rows[0]) throw httpError(404, "Producto no encontrado.");
  await pool.query("INSERT INTO favorites (user_id,product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [req.user.id, req.params.productId]);
  res.status(201).json({ productId: Number(req.params.productId) });
}));

router.delete("/:productId", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM favorites WHERE user_id=$1 AND product_id=$2", [req.user.id, req.params.productId]);
  res.status(204).end();
}));

module.exports = router;
