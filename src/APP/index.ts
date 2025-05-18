import "module-alias/register"

import express,{Express} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "@/CORE/utils/config";
import { initRedis } from "@/CORE/services/redis";
import { AppRouter } from "./App_router";
import{ errorHandler }from "@/CORE/middleware/errorHandler";



const app:Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  
app.use("/api", AppRouter);


app.use(errorHandler);


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const initializeServices = async () => {
  await initRedis();
  
};

const startServer = () => {
  const PORT = config.PORT || 3000;
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
