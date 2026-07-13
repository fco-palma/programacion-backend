const pool = require("../config/db");
const { httpError } = require("../lib/http");

const PRODUCT_SELECT = `
  SELECT p.id,
         p.category_id AS "categoryId",
         c.label AS category,
         c.species AS type,
         p.name,
         p.description AS "desc",
         p.price,
         p.original_price AS original,
         p.rating,
         p.review_count AS reviews,
         p.badge,
         p.badge_color AS "badgeColor",
         p.image_url AS image,
         p.stock AS inventory,
         p.status,
         p.created_at AS "createdAt",
         COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT t.name), NULL), '{}') AS tags
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_tags pt ON pt.product_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id`;

const PRODUCT_GROUP = `
   GROUP BY p.id, c.id
   ORDER BY p.created_at DESC, p.id DESC`;

function mapProduct(row) {
  if (!row) return null;
  return {
    ...row,
    id: Number(row.id),
    categoryId: Number(row.categoryId),
    price: Number(row.price),
    original: row.original === null ? null : Number(row.original),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    inventory: Number(row.inventory),
  };
}

async function listProducts({ includeHidden = false } = {}) {
  const result = await pool.query(
    `${PRODUCT_SELECT}${includeHidden ? "" : " WHERE p.status = 'Activo'"}${PRODUCT_GROUP}`,
  );
  return result.rows.map(mapProduct);
}

async function getProductById(id, client = pool) {
  const result = await client.query(`${PRODUCT_SELECT} WHERE p.id = $1${PRODUCT_GROUP}`, [id]);
  return mapProduct(result.rows[0]);
}

function money(value, field, { nullable = false } = {}) {
  if ((value === null || value === undefined || value === "") && nullable) return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^0-9,-]/g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0) throw httpError(400, `${field} debe ser un número válido.`);
  return parsed;
}

function validateProduct(input) {
  const name = String(input.name || "").trim();
  const category = String(input.category || "").trim();
  if (!name) throw httpError(400, "El nombre del producto es obligatorio.");
  if (!category && !input.categoryId) throw httpError(400, "La categoría es obligatoria.");

  const inventory = Number(input.inventory ?? 0);
  if (!Number.isInteger(inventory) || inventory < 0) throw httpError(400, "El stock debe ser un entero mayor o igual que cero.");

  const status = input.status || "Activo";
  if (!["Activo", "Inactivo", "Oculto"].includes(status)) throw httpError(400, "El estado del producto no es válido.");

  const badgeColor = input.badgeColor || "gray";
  if (!["blue", "orange", "green", "red", "gray"].includes(badgeColor)) throw httpError(400, "El color de etiqueta no es válido.");

  return {
    name,
    category,
    categoryId: input.categoryId ? Number(input.categoryId) : null,
    desc: String(input.desc || "").trim(),
    price: money(input.price, "El precio"),
    original: money(input.original, "El precio anterior", { nullable: true }),
    rating: Math.min(5, Math.max(0, Number(input.rating ?? 0))),
    reviews: Math.max(0, Math.trunc(Number(input.reviews ?? 0))),
    badge: String(input.badge || "").trim(),
    badgeColor,
    image: String(input.image || "").trim(),
    inventory,
    status,
    tags: Array.isArray(input.tags) ? [...new Set(input.tags.map((tag) => String(tag).trim()).filter(Boolean))] : [],
  };
}

async function resolveCategory(client, data) {
  const result = data.categoryId
    ? await client.query("SELECT id FROM categories WHERE id = $1", [data.categoryId])
    : await client.query("SELECT id FROM categories WHERE label = $1", [data.category]);
  if (!result.rows[0]) throw httpError(400, "La categoría seleccionada no existe.");
  return result.rows[0].id;
}

async function replaceTags(client, productId, tags) {
  await client.query("DELETE FROM product_tags WHERE product_id = $1", [productId]);
  for (const tag of tags) {
    const tagResult = await client.query(
      "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
      [tag],
    );
    await client.query("INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [productId, tagResult.rows[0].id]);
  }
}

async function createProduct(input, userId) {
  const data = validateProduct(input);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const categoryId = await resolveCategory(client, data);
    const result = await client.query(
      `INSERT INTO products
        (category_id, name, description, price, original_price, rating, review_count, badge, badge_color, image_url, stock, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [categoryId, data.name, data.desc, data.price, data.original, data.rating, data.reviews, data.badge, data.badgeColor, data.image, data.inventory, data.status],
    );
    const productId = result.rows[0].id;
    await replaceTags(client, productId, data.tags);
    if (data.inventory > 0) {
      await client.query(
        "INSERT INTO inventory_movements (product_id, user_id, quantity_change, reason) VALUES ($1,$2,$3,'Stock inicial')",
        [productId, userId, data.inventory],
      );
    }
    await client.query("COMMIT");
    return getProductById(productId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateProduct(id, input, userId) {
  const data = validateProduct(input);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query("SELECT stock FROM products WHERE id = $1 FOR UPDATE", [id]);
    if (!existing.rows[0]) throw httpError(404, "Producto no encontrado.");
    const categoryId = await resolveCategory(client, data);
    await client.query(
      `UPDATE products SET
         category_id=$1, name=$2, description=$3, price=$4, original_price=$5,
         rating=$6, review_count=$7, badge=$8, badge_color=$9, image_url=$10, stock=$11, status=$12
       WHERE id=$13`,
      [categoryId, data.name, data.desc, data.price, data.original, data.rating, data.reviews, data.badge, data.badgeColor, data.image, data.inventory, data.status, id],
    );
    await replaceTags(client, id, data.tags);
    const difference = data.inventory - Number(existing.rows[0].stock);
    if (difference !== 0) {
      await client.query(
        "INSERT INTO inventory_movements (product_id, user_id, quantity_change, reason) VALUES ($1,$2,$3,'Ajuste administrativo')",
        [id, userId, difference],
      );
    }
    await client.query("COMMIT");
    return getProductById(id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createProduct, getProductById, listProducts, updateProduct };
