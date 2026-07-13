require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const { optionalAuth } = require("./middleware/auth");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const path = require("path");

const app = express();
const allowedOrigins = String(process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim());

app.set("trust proxy", 1);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origen no permitido por CORS."));
  },
  credentials: true,
}));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads"), { maxAge: "7d", immutable: true }));
app.use(express.json({ limit: "1mb" }));
app.use(optionalAuth);

app.get("/api/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/announcements", announcementRoutes);

// Compatibilidad temporal con la interfaz anterior.
app.use("/productos", productRoutes);

app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada." }));

app.use((error, _req, res, _next) => {
  const status = Number(error.status) || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    error: status >= 500 ? "Ocurrió un error interno en el servidor." : error.message,
    ...(error.code && !String(error.code).match(/^23/) ? { code: error.code } : {}),
  });
});

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, () => {
  console.log(`API iniciada en http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = app;
