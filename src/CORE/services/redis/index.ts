import { createClient } from "redis";
import { config } from "@/CORE/utils/config";

type RedisClient = ReturnType<typeof createClient>;



let redisClient: RedisClient;
const testurl = `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`
console.log(` Connecting to Redis at ${testurl}`)

export const initRedis = async (): Promise<RedisClient> => {
  redisClient = createClient({
    url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  });

  redisClient.on("error", (err) => console.error("Redis Client Error:", err));

  await redisClient.connect();
  return redisClient;
};

export const getRedisClient = (): RedisClient => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};
