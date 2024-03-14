import * as fs from "fs";
import * as path from "path";

import { pool } from "./src/config";

async function runMigrations() {
  const migrationsPath = path.join(__dirname, "src/migrations");

  try {
    const files = fs.readdirSync(migrationsPath);

    for (const file of files) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(filePath, "utf8");
        await pool.query(sql);
        console.log(`Migration successful for ${file}`);
      }
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    pool.end();
  }
}

runMigrations();
