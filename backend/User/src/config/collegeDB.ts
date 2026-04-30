import dotenv from 'dotenv'
dotenv.config()
import pkg from "pg";
const { Pool } = pkg;

if (!process.env.COLLEGE_DATABASE_URL) {
  throw new Error("COLLEGE_DATABASE_URL is not defined");
}

export const collegeDB = new Pool({
  connectionString: process.env.COLLEGE_DATABASE_URL,

  ssl: {
    rejectUnauthorized: false, 
  },
});

collegeDB.on("connect", () => {
  console.log("🎓 College DB connected successfully");
});

collegeDB.on("error", (err) => {
  console.error("❌ College DB error:", err.message);
});