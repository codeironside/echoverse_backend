
import { Server } from "socket.io";

let ioInstance: Server;

export const initSocket = (io: Server) => {
  ioInstance = io;

  ioInstance.on("connection", (socket) => {
    socket.on("chatMessage", (message) => {
      io.emit("chatMessage", message);
    });
  });
};

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
};
