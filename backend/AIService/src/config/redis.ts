import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Redis client banayein
export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

redisClient.on("connect", () => {
    console.log("🟢 Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
});

// Yeh function banayein taaki index.ts isko startServer mein call kar sake
export const connectRedis = async () => {
    await redisClient.connect(); 
};