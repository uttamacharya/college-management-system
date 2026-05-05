import express from "express";
import dotenv from "dotenv";
dotenv.config();


import authRoutes from './routes/auth.route.js'

// Redis init (auto connect)
import "./config/redis.js";

// RabbitMQ connect
import { connectRabbitMQ } from "./config/rabbitMQ.js";
const app = express();
// middleware
app.use(express.json());
// app.use(cors());

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

//  routes
app.use("/api/auth", authRoutes);

//start server function
const startServer = async () => {
  try {
    // RabbitMQ connect
    await connectRabbitMQ();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Server start failed", error);
  }
};

startServer();