
import { Socket } from "socket.io";

export const registerSocketHandlers = (socket: Socket) => {
  socket.on("chat:message", (msg) => {
    console.log(`💬 Message received: ${msg}`);
    socket.broadcast.emit("chat:message", msg);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });
};
