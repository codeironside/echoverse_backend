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

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_SUFFIX, AppRouter);

app.use(errorHandler);

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

const initializeServices = async () => {
  // await initRedis();
};
export const prismaClient = new PrismaClient({log:['query']});

const startServer = () => {
  const PORT = config.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log([chalk.green(day)], `Server running on port ${PORT}`);
  });
};

initializeServices()
  .then(startServer)
  .catch((error) => {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  });
