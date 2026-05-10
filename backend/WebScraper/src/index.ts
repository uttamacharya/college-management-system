import express from "express";
import dotenv from "dotenv";
dotenv.config();

import scraperRoutes from './routes/scraper.route.js';

// Redis init (auto connect)
import "./config/redis.js";

// RabbitMQ connect
import { connectRabbitMQ } from "./config/rabbitMQ.js";

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "WebScraper API is working" });
});

// routes
app.use("/api/scraper", scraperRoutes);

// start server function
const startServer = async () => {
  try {
    // RabbitMQ connect
    await connectRabbitMQ();

    const port = process.env.PORT || 5002; // Different port

    app.listen(port, () => {
      console.log(`🚀 WebScraper Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Server start failed", error);
  }
};

startServer();