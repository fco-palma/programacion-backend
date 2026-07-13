const crypto = require("crypto");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");

const COOKIE_NAME = "pet_session";

function readCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(";");
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return next();

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)],
  );

  if (result.rows[0]) {
    req.user = result.rows[0];
    req.sessionTokenHash = hashToken(token);
  }
  next();
});

function requireAuth(req, _res, next) {
  if (!req.user) return next(httpError(401, "Debes iniciar sesión para continuar.", "AUTH_REQUIRED"));
  next();
}

function requireAdmin(req, _res, next) {
  if (!req.user) return next(httpError(401, "Debes iniciar sesión para continuar.", "AUTH_REQUIRED"));
  if (req.user.role !== "admin") return next(httpError(403, "No tienes permisos de administrador.", "ADMIN_REQUIRED"));
  next();
}

module.exports = { COOKIE_NAME, hashToken, optionalAuth, requireAuth, requireAdmin };
