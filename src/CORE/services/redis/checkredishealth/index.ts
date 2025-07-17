import { getRedisClient } from "../index";
import logger from "@/CORE/logger";
export const checkRedis = async (): Promise<"UP" | "DOWN"> => {
  try {
    const client = getRedisClient();
    const pong = await client.ping();
    logger.info(`response is ${pong}`);
    return pong === "PONG" ? "UP" : "DOWN";
  } catch (err) {
    logger.error(`redis is down ${err}`)
    console.error("Redis health check failed:", err);
    return "DOWN";
  }
};
