import { Request, Response } from "express";

import { checkDatabase } from "@/CORE/services/database/databasehealth";
import logger from "@/CORE/logger";
import { checkRedis } from "@/CORE/services/redis/checkredishealth";
import { checkSocketStatus } from "@/CORE/services/socketio/";

export const healthcheck = async (req: Request, res: Response) => {
  const dbStatus = await checkDatabase();
  const redisStatus = await checkRedis();
  const socketStatus = checkSocketStatus();
  logger.info(`database is ${dbStatus}`);
  res.status(202).json({
    status: "ok",
    services: {
      database: dbStatus,
      redis: redisStatus,
      socket: {
        status: socketStatus.status,
        connectedClients: socketStatus.connectedClients,
      },
    },
    message: "Health check passed, server up and running",
    timestamp: new Date().toISOString(),
  });
};
