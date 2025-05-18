import "module-alias/register"

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { loadEnv } from "@config/env";
import { initRedis } from "@config/redis";
import apiRouter from "@routes/api";
import errorHandler from "@middleware/errorHandler";

loadEnv();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRouter);

// Error handling
app.use(errorHandler);

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Initialize services
const initializeServices = async () => {
  await initRedis();
  // Add other service initializations here
};

const startServer = () => {
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initializeServices()
  .then(startServer)
  .catch((error) => {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  });
