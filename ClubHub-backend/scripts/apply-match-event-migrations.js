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
    path.join(
      __dirname,
      "..",
      "database",
      "migrations",
      "20260907_add_second_yellow.sql",
    ),
    "utf8",
  );

  await client.connect();
  try {
    await client.query(sql);
    console.log("Migração de detalhes dos cartões aplicada.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
