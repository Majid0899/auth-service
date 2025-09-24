// src/config/redis.ts
import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Handle Redis errors
redisClient.on("error", (err: Error) => console.error("Redis Client Error:", err));

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

export { redisClient };
