require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const baseUrl = `http://localhost:${process.env.PORT || 3000}/api`;
let adminCookie = "";
let customerCookie = "";
let customerEmail = "";
let categoryId = null;
let productId = null;
let uploadedFilename = "";
let originalTheme = "permanente";
let originalHeroImage = "";
let announcementId = null;

async function call(path, { cookie, ...options } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path}: ${body?.error || response.status}`);
  return { body, cookie: response.headers.get("set-cookie")?.split(";")[0] || "" };
}

async function cleanup() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (customerEmail) {
      const user = await client.query("SELECT id FROM users WHERE email=$1", [customerEmail]);
      if (user.rows[0]) {
        await client.query("DELETE FROM orders WHERE user_id=$1", [user.rows[0].id]);
        await client.query("DELETE FROM users WHERE id=$1", [user.rows[0].id]);
      }
    }
    if (productId) await client.query("DELETE FROM products WHERE id=$1", [productId]);
    if (categoryId) await client.query("DELETE FROM categories WHERE id=$1", [categoryId]);
    if (announcementId) await client.query("DELETE FROM announcements WHERE id=$1", [announcementId]);
    await client.query("UPDATE site_settings SET value=$1 WHERE key='theme'", [originalTheme]);
    if (originalHeroImage) await client.query("UPDATE site_settings SET value=$1 WHERE key='hero_perros_image'", [originalHeroImage]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  if (uploadedFilename) {
    await fs.promises.unlink(path.resolve(__dirname, "../uploads", uploadedFilename)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}

async function main() {
  const health = await call("/health");
  if (health.body.database !== "connected") throw new Error("La base de datos no está conectada.");

  const login = await call("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  });
  adminCookie = login.cookie;
  if (login.body.user.role !== "admin") throw new Error("La cuenta configurada no es administradora.");

  const initialSettings = await call("/settings");
  originalTheme = initialSettings.body.theme;
  originalHeroImage = initialSettings.body.heroImages.perros;
  await call("/settings/theme", {
    method: "PATCH",
    cookie: adminCookie,
    body: JSON.stringify({ theme: "autumn" }),
  });
  const updatedSettings = await call("/settings");
  if (updatedSettings.body.theme !== "autumn") throw new Error("El tema de la tienda no fue persistido.");

  const upload = await call("/uploads/images", {
    method: "POST",
    cookie: adminCookie,
    headers: { "Content-Type": "image/png" },
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
  });
  uploadedFilename = upload.body.filename;

  await call("/settings/hero", {
    method: "PATCH",
    cookie: adminCookie,
    body: JSON.stringify({ species: "perros", image: upload.body.url }),
  });
  const heroSettings = await call("/settings");
  if (heroSettings.body.heroImages.perros !== upload.body.url) throw new Error("La imagen principal no fue persistida.");

  const announcement = await call("/announcements", {
    method: "POST",
    cookie: adminCookie,
    body: JSON.stringify({
      title: "Anuncio temporal de prueba",
      subtitle: "Prueba automática",
      image: upload.body.url,
      link: "#productos",
      active: true,
      durationSeconds: 4,
      sortOrder: 99,
    }),
  });
  announcementId = announcement.body.id;
  const publicAnnouncements = await call("/announcements");
  if (!publicAnnouncements.body.some((item) => item.id === announcementId)) throw new Error("El anuncio no fue persistido.");

  const category = await call("/categories", {
    method: "POST",
    cookie: adminCookie,
    body: JSON.stringify({ label: `Prueba ${Date.now()}`, species: "perros", image: "" }),
  });
  categoryId = category.body.id;

  const product = await call("/products", {
    method: "POST",
    cookie: adminCookie,
    body: JSON.stringify({
      categoryId,
      category: category.body.label,
      name: "Producto temporal de prueba",
      desc: "Producto creado por la prueba automática.",
      price: 1990,
      original: null,
      rating: 4,
      reviews: 0,
      badge: "Nuevo",
      badgeColor: "orange",
      image: upload.body.url,
      inventory: 5,
      status: "Activo",
      tags: ["Nuevo"],
    }),
  });
  productId = product.body.id;

  await call(`/products/${productId}`, {
    method: "PATCH",
    cookie: adminCookie,
    body: JSON.stringify({ ...product.body, inventory: 6 }),
  });

  customerEmail = `prueba-${crypto.randomUUID()}@lilypets.local`;
  const registration = await call("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: customerEmail, password: "Prueba-segura-2026" }),
  });
  customerCookie = registration.cookie;

  await call(`/favorites/${productId}`, { method: "POST", cookie: customerCookie });
  await call(`/cart/${productId}`, { method: "PUT", cookie: customerCookie, body: JSON.stringify({ quantity: 2 }) });
  const order = await call("/orders", { method: "POST", cookie: customerCookie });
  if (order.body.total !== 3980) throw new Error("El total del pedido no coincide con el esperado.");

  const orders = await call("/orders", { cookie: customerCookie });
  if (!orders.body.some((item) => item.id === order.body.id)) throw new Error("El pedido no fue persistido.");

  console.log("Prueba completa: autenticación, tema, imágenes principales, anuncios, CRUD, carrito, pedido e inventario funcionan.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await cleanup();
    } finally {
      await pool.end();
    }
  });
