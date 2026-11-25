import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local first.");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, "..", "db", "schema.sql");
const schema = await readFile(schemaPath, "utf8");

const statements = schema
  .replace(/--.*$/gm, "")
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter((statement) => statement.length > 0);

const sql = neon(databaseUrl);

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`Database initialized with ${statements.length} statements.`);
