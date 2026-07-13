require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function main() {
  const databaseDirectory = path.resolve(__dirname, "../../database");
  const schema = fs.readFileSync(path.join(databaseDirectory, "schema.sql"), "utf8");
  const inserts = fs.readFileSync(path.join(databaseDirectory, "inserts.sql"), "utf8");
  await pool.query(schema);
  await pool.query(inserts);
  console.log("Base de datos preparada correctamente.");
}

main()
  .catch((error) => {
    console.error("No fue posible preparar la base de datos:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
