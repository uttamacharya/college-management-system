import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL is not defined");
}

export const appDB = new Pool({
  connectionString: process.env.APP_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

appDB.on("connect", () => {
  console.log("✅ App DB connected successfully");
});

appDB.on("error", (err) => {
  console.error("❌ App DB error:", err.message);
});