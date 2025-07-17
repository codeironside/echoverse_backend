
import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers";
import logger from "@/CORE/logger";

let io: Server | null = null;
let connectedClients = new Set<string>();

export const initSocket = (serverIO: Server) => {
  io = serverIO;

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    connectedClients.add(socket.id);

    registerSocketHandlers(socket);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      connectedClients.delete(socket.id);
    });
  });

  logger.info("✅ Socket.IO initialized");
};

export const getIO = (): Server => {
  if (!io) {
    logger.error("SocketIO not initialized");
    throw new Error("SocketIO not initialized");
  }
  return io;
};

export const checkSocketStatus = () => {
  return {
    status: io ? "UP" : "DOWN",
    connectedClients: connectedClients.size,
  };
};
