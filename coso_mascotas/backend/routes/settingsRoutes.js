const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
const THEMES = ["winter", "spring", "summer", "autumn", "permanente"];
const GLOBAL_DEFAULTS = {
  freeShippingMinimum: 50000,
  standardShippingCost: 4500,
  lowStockThreshold: 5,
  supportPhone: "+56 9 1234 5678",
  storeEmail: "contacto@lilypets.cl",
  address: "27 Oriente 22 y media Norte 3431, Talca, Maule.",
  instagramUrl: "https://instagram.com/lilypets.store",
  tiktokUrl: "https://tiktok.com/@lilypets.store",
  facebookUrl: "https://facebook.com/lilypets.store",
};
const GLOBAL_KEYS = {
  freeShippingMinimum: "free_shipping_minimum",
  standardShippingCost: "standard_shipping_cost",
  lowStockThreshold: "low_stock_threshold",
  supportPhone: "support_phone",
  storeEmail: "store_email",
  address: "store_address",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
  facebookUrl: "facebook_url",
};

function globalSettingsFromRows(settings) {
  return {
    freeShippingMinimum: Number(settings.free_shipping_minimum ?? GLOBAL_DEFAULTS.freeShippingMinimum),
    standardShippingCost: Number(settings.standard_shipping_cost ?? GLOBAL_DEFAULTS.standardShippingCost),
    lowStockThreshold: Number(settings.low_stock_threshold ?? GLOBAL_DEFAULTS.lowStockThreshold),
    supportPhone: settings.support_phone ?? GLOBAL_DEFAULTS.supportPhone,
    storeEmail: settings.store_email ?? GLOBAL_DEFAULTS.storeEmail,
    address: settings.store_address ?? GLOBAL_DEFAULTS.address,
    instagramUrl: settings.instagram_url ?? GLOBAL_DEFAULTS.instagramUrl,
    tiktokUrl: settings.tiktok_url ?? GLOBAL_DEFAULTS.tiktokUrl,
    facebookUrl: settings.facebook_url ?? GLOBAL_DEFAULTS.facebookUrl,
  };
}

router.get("/", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT key,value FROM site_settings");
  const settings = Object.fromEntries(result.rows.map((row) => [row.key, row.value]));
  res.json({
    theme: settings.theme || "permanente",
    heroImages: {
      perros: settings.hero_perros_image || "",
      gatos: settings.hero_gatos_image || "",
    },
    global: globalSettingsFromRows(settings),
  });
}));

router.patch("/global", requireAdmin, asyncHandler(async (req, res) => {
  const global = {
    freeShippingMinimum: Number(req.body.freeShippingMinimum),
    standardShippingCost: Number(req.body.standardShippingCost),
    lowStockThreshold: Number(req.body.lowStockThreshold),
    supportPhone: String(req.body.supportPhone || "").trim(),
    storeEmail: String(req.body.storeEmail || "").trim(),
    address: String(req.body.address || "").trim(),
    instagramUrl: String(req.body.instagramUrl || "").trim(),
    tiktokUrl: String(req.body.tiktokUrl || "").trim(),
    facebookUrl: String(req.body.facebookUrl || "").trim(),
  };

  if (!Number.isFinite(global.freeShippingMinimum) || global.freeShippingMinimum < 0) throw httpError(400, "El monto de envío gratis no es válido.");
  if (!Number.isFinite(global.standardShippingCost) || global.standardShippingCost < 0) throw httpError(400, "El costo de envío no es válido.");
  if (!Number.isInteger(global.lowStockThreshold) || global.lowStockThreshold < 1 || global.lowStockThreshold > 10000) throw httpError(400, "La alerta de stock debe estar entre 1 y 10.000 unidades.");
  if (!global.supportPhone || global.supportPhone.length > 60) throw httpError(400, "Ingresa un teléfono de soporte válido.");
  if (!/^\S+@\S+\.\S+$/.test(global.storeEmail) || global.storeEmail.length > 255) throw httpError(400, "Ingresa un correo válido.");
  if (!global.address || global.address.length > 300) throw httpError(400, "Ingresa una dirección válida.");
  for (const field of ["instagramUrl", "tiktokUrl", "facebookUrl"]) {
    try {
      const url = new URL(global[field]);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      throw httpError(400, "Los enlaces de redes sociales deben ser URLs válidas.");
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [field, key] of Object.entries(GLOBAL_KEYS)) {
      await client.query(
        `INSERT INTO site_settings (key,value,updated_by) VALUES ($1,$2,$3)
         ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by`,
        [key, String(global[field]), req.user.id],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  res.json(global);
}));

router.patch("/hero", requireAdmin, asyncHandler(async (req, res) => {
  const species = String(req.body.species || "");
  const image = String(req.body.image || "").trim();
  if (!["perros", "gatos"].includes(species)) throw httpError(400, "La especie seleccionada no es válida.");
  if (!image) throw httpError(400, "La imagen principal es obligatoria.");
  const key = `hero_${species}_image`;
  await pool.query(
    `INSERT INTO site_settings (key,value,updated_by) VALUES ($1,$2,$3)
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by`,
    [key, image, req.user.id],
  );
  res.json({ species, image });
}));

router.patch("/theme", requireAdmin, asyncHandler(async (req, res) => {
  const theme = String(req.body.theme || "");
  if (!THEMES.includes(theme)) throw httpError(400, "El tema seleccionado no es válido.");
  await pool.query(
    `INSERT INTO site_settings (key,value,updated_by) VALUES ('theme',$1,$2)
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by`,
    [theme, req.user.id],
  );
  res.json({ theme });
}));

module.exports = router;
