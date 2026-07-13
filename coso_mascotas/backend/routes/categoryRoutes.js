const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function validate(body) {
  const label = String(body.label || "").trim();
  const species = String(body.species || "").trim();
  const image = String(body.image ?? body.imageUrl ?? "").trim();
  if (!label) throw httpError(400, "El nombre de la categoría es obligatorio.");
  if (!["perros", "gatos"].includes(species)) throw httpError(400, "La especie no es válida.");
  return { label, species, image };
}

router.get("/", asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.label, c.species, c.image_url AS image, COUNT(p.id)::int AS "productCount"
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.status = 'Activo'
      GROUP BY c.id
      ORDER BY c.id`,
  );
  res.json(result.rows.map((row) => ({ ...row, id: Number(row.id), count: `${row.productCount} productos` })));
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const data = validate(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO categories (label, species, image_url) VALUES ($1,$2,$3) RETURNING id,label,species,image_url AS image",
      [data.label, data.species, data.image],
    );
    res.status(201).json({ ...result.rows[0], id: Number(result.rows[0].id), count: "0 productos" });
  } catch (error) {
    if (error.code === "23505") throw httpError(409, "Esa categoría ya existe.");
    throw error;
  }
}));

router.patch("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const data = validate(req.body);
  try {
    const result = await pool.query(
      "UPDATE categories SET label=$1,species=$2,image_url=$3 WHERE id=$4 RETURNING id,label,species,image_url AS image",
      [data.label, data.species, data.image, req.params.id],
    );
    if (!result.rows[0]) throw httpError(404, "Categoría no encontrada.");
    res.json({ ...result.rows[0], id: Number(result.rows[0].id), count: req.body.count || "0 productos" });
  } catch (error) {
    if (error.code === "23505") throw httpError(409, "Esa categoría ya existe.");
    throw error;
  }
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM categories WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) throw httpError(404, "Categoría no encontrada.");
    res.status(204).end();
  } catch (error) {
    if (error.code === "23503") throw httpError(409, "No puedes eliminar una categoría que contiene productos.");
    throw error;
  }
}));

module.exports = router;
