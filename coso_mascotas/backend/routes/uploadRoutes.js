const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, "../uploads");
const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

fs.mkdirSync(uploadDirectory, { recursive: true });

router.post(
  "/images",
  requireAdmin,
  express.raw({ type: Object.keys(extensions), limit: "5mb" }),
  asyncHandler(async (req, res) => {
    const extension = extensions[req.headers["content-type"]];
    if (!extension) throw httpError(415, "El archivo debe ser JPG, PNG, WebP o GIF.");
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) throw httpError(400, "No se recibió una imagen válida.");

    const filename = `${crypto.randomUUID()}${extension}`;
    await fs.promises.writeFile(path.join(uploadDirectory, filename), req.body, { flag: "wx" });
    const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    res.status(201).json({ url: publicUrl, filename });
  }),
);

module.exports = router;
