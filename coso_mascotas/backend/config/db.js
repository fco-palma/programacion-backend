const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || "tienda_mascotas",
      },
);

pool.on("error", (error) => {
  console.error("Conexión inesperadamente interrumpida con PostgreSQL:", error.message);
});

module.exports = pool;
