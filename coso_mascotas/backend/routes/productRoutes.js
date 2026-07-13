const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAdmin } = require("../middleware/auth");
const { createProduct, getProductById, listProducts, updateProduct } = require("../services/products");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  res.json(await listProducts({ includeHidden: req.user?.role === "admin" }));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product || (product.status !== "Activo" && req.user?.role !== "admin")) throw httpError(404, "Producto no encontrado.");
  res.json(product);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  res.status(201).json(await createProduct(req.body, req.user.id));
}));

router.patch("/:id", requireAdmin, asyncHandler(async (req, res) => {
  res.json(await updateProduct(req.params.id, req.body, req.user.id));
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);
  if (!result.rows[0]) throw httpError(404, "Producto no encontrado.");
  res.status(204).end();
}));

module.exports = router;
