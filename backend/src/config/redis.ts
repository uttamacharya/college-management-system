import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL as string);

const connectRedis = async (): Promise<void> => {
  try {
    await redis.ping();
    console.log("Redis connection established");
  } catch (error) {
    console.error("Redis connection failed", error);
    throw error;
  }
};

export { redis, connectRedis };
