
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()
export const checkDatabase = async (): Promise<'up' | 'down'> => {
  try {
    await prisma.$queryRaw`SELECT 1`; 
    return 'up';
  } catch (error) {
    console.error('Database check failed:', error);
    return 'down';
  }
};


// export const healthCheck = async (req: Request, res: Response) => {
//   const dbStatus = await checkDatabase();
//    const redisStatus = await checkRedis();

//   res.json({
//     status: "OK",
//     services: {
//       database: dbStatus,
//       // redis: redisStatus,
//     },
//   });
// };
