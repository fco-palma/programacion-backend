require("dotenv").config();

const pool = require("../config/db");
const { hashPassword } = require("../lib/password");

async function main() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  const name = String(process.env.ADMIN_NAME || "Administrador").trim();
  if (!email || password.length < 8) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 8 caracteres) en backend/.env.");
  }
  const passwordHash = await hashPassword(password);
  await pool.query(
    `INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,'admin')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name,password_hash=EXCLUDED.password_hash,role='admin'`,
    [name, email, passwordHash],
  );
  console.log(`Administrador ${email} creado o actualizado correctamente.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
