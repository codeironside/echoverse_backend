import { createClient } from "redis";
import { loadEnv } from "./env";

type RedisClient = ReturnType<typeof createClient>;

const env = loadEnv();

let redisClient: RedisClient;

export const initRedis = async (): Promise<RedisClient> => {
  redisClient = createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
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
