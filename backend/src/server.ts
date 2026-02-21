import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { pool } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server (future me Socket.IO ke liye useful)
const server = http.createServer(app);

// Start server
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Test database connection
  try {
    await pool.query("SELECT 1");
    console.log(" Database connected successfully");
  } catch (error) {
    console.error(" Database connection failed:", error);
  }
});