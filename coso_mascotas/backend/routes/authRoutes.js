const crypto = require("crypto");
const express = require("express");
const pool = require("../config/db");
const { asyncHandler, httpError } = require("../lib/http");
const { hashPassword, verifyPassword } = require("../lib/password");
const { COOKIE_NAME, hashToken, requireAuth } = require("../middleware/auth");

const router = express.Router();
const SESSION_DAYS = 30;

function publicUser(user) {
  return { id: Number(user.id), name: user.name, email: user.email, role: user.role };
}

async function startSession(userId, res) {
  const token = crypto.randomBytes(32).toString("base64url");
  const maxAge = SESSION_DAYS * 24 * 60 * 60 * 1000;
  await pool.query(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1,$2,NOW() + ($3 * INTERVAL '1 millisecond'))",
    [userId, hashToken(token), maxAge],
  );
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

router.post("/register", asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const name = String(req.body.name || email.split("@")[0] || "Cliente").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, "Ingresa un correo electrónico válido.");
  if (password.length < 8) throw httpError(400, "La contraseña debe tener al menos 8 caracteres.");

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,role",
      [name, email, passwordHash],
    );
    await startSession(result.rows[0].id, res);
    res.status(201).json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    if (error.code === "23505") throw httpError(409, "Ya existe una cuenta con ese correo.");
    throw error;
  }
}));

router.post("/login", asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const result = await pool.query("SELECT id,name,email,role,password_hash FROM users WHERE email=$1", [email]);
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw httpError(401, "Correo o contraseña incorrectos.");
  }
  await startSession(user.id, res);
  res.json({ user: publicUser(user) });
}));

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post("/logout", asyncHandler(async (req, res) => {
  if (req.sessionTokenHash) await pool.query("DELETE FROM sessions WHERE token_hash=$1", [req.sessionTokenHash]);
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", path: "/" });
  res.status(204).end();
}));

module.exports = router;
