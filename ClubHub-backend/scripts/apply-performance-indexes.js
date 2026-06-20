const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definido.");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: true }
        : undefined,
  });
  const sql = fs.readFileSync(
    path.join(__dirname, "..", "database", "performance-indexes.sql"),
    "utf8",
  );

  await client.connect();
  try {
    await client.query(sql);
    console.log("Índices de performance aplicados.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
