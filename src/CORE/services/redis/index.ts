import { createClient } from "redis";
import { config } from "@/CORE/utils/config";
import logger from "@/CORE/logger";

type RedisClient = ReturnType<typeof createClient>;



let redisClient: RedisClient;

export const initRedis = async (): Promise<RedisClient> => {
  redisClient = createClient({
    url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  });
  

  redisClient.on("error", (err) => console.error("Redis Client Error:", err));

  await redisClient.connect();
  const testurl = `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`;
  logger.info(` Connected to Redis  .......`);
  return redisClient;
};

export const getRedisClient = (): RedisClient => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};
