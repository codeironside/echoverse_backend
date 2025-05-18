‹
import { Request, Response } from "express";

export const healthCheck = async (req: Request, res: Response) => {
  const dbStatus = await checkDatabase();
  const redisStatus = await checkRedis();

  res.json({
    status: "OK",
    services: {
      database: dbStatus,
      redis: redisStatus,
    },
  });
};
