const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function mapAnnouncement(row) {
  return {
    id: Number(row.id),
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    link: row.link,
    active: row.active,
    durationSeconds: Number(row.durationSeconds),
    sortOrder: Number(row.sortOrder),
  };
}

function validate(body) {
  const title = String(body.title || "").trim();
  const image = String(body.image || "").trim();
  const durationSeconds = Number(body.durationSeconds ?? 6);
  const sortOrder = Number(body.sortOrder ?? 0);
  if (!title) throw httpError(400, "El título del anuncio es obligatorio.");
  if (!image) throw httpError(400, "La imagen del anuncio es obligatoria.");
  if (!Number.isInteger(durationSeconds) || durationSeconds < 3 || durationSeconds > 60) {
    throw httpError(400, "La duración debe estar entre 3 y 60 segundos.");
  }
  if (!Number.isInteger(sortOrder) || sortOrder < 0) throw httpError(400, "El orden del anuncio no es válido.");
  return {
    title,
    subtitle: String(body.subtitle || "").trim(),
    image,
    link: String(body.link || "").trim(),
    active: body.active !== false,
    durationSeconds,
    sortOrder,
  };
}

const selectAnnouncements = `
  SELECT id,title,subtitle,image_url AS image,link_url AS link,active,
         duration_seconds AS "durationSeconds",sort_order AS "sortOrder"
    FROM announcements`;

router.get("/", asyncHandler(async (req, res) => {
  const where = req.user?.role === "admin" ? "" : " WHERE active=TRUE";
  const result = await pool.query(`${selectAnnouncements}${where} ORDER BY sort_order,id`);
  res.json(result.rows.map(mapAnnouncement));
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const data = validate(req.body);
  const result = await pool.query(
    `INSERT INTO announcements (title,subtitle,image_url,link_url,active,duration_seconds,sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id,title,subtitle,image_url AS image,link_url AS link,active,
               duration_seconds AS "durationSeconds",sort_order AS "sortOrder"`,
    [data.title, data.subtitle, data.image, data.link, data.active, data.durationSeconds, data.sortOrder],
  );
  res.status(201).json(mapAnnouncement(result.rows[0]));
}));

router.patch("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const data = validate(req.body);
  const result = await pool.query(
    `UPDATE announcements SET title=$1,subtitle=$2,image_url=$3,link_url=$4,active=$5,duration_seconds=$6,sort_order=$7
      WHERE id=$8
      RETURNING id,title,subtitle,image_url AS image,link_url AS link,active,
                duration_seconds AS "durationSeconds",sort_order AS "sortOrder"`,
    [data.title, data.subtitle, data.image, data.link, data.active, data.durationSeconds, data.sortOrder, req.params.id],
  );
  if (!result.rows[0]) throw httpError(404, "Anuncio no encontrado.");
  res.json(mapAnnouncement(result.rows[0]));
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const result = await pool.query("DELETE FROM announcements WHERE id=$1 RETURNING id", [req.params.id]);
  if (!result.rows[0]) throw httpError(404, "Anuncio no encontrado.");
  res.status(204).end();
}));

module.exports = router;
