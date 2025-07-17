import "module-alias/register";

import chalk from "chalk";
import { Server } from "socket.io";
import { createServer } from "http";
import { AppRouter } from "./App_router";
import express, { Express } from "express";
import { config } from "@/CORE/utils/config";
import { day } from "@/CORE/utils/types/global";
import { initRedis } from "@/CORE/services/redis";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "@/CORE/middleware/errorHandler";
import { API_SUFFIX } from "@/CORE/utils/types/global";
import Logger from "@/CORE/logger"

import { Server as SocketIOServer } from "socket.io";

import { initSocket } from "@/CORE/services/socketio";
const app: Express = express();
const httpServer = createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_SUFFIX, AppRouter);

app.use(errorHandler);


const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  
});

initSocket(io);




const initializeServices = async () => {
  await initRedis();
};
export const prismaClient = new PrismaClient({log:['query']});

const startServer = async () => {
  const PORT = config.PORT || 3000;
  httpServer.listen(PORT, () => {
    Logger.info(`server running on port ${PORT}`);
  });
};

initializeServices()
  .then(startServer)
  .catch((error) => {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  });



export default app
