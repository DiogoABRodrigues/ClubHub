import { Server } from "socket.io";
import http from "http";
import { isAllowedOrigin } from "./env";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error("Origem Socket.IO nao permitida"));
      },
      methods: ["GET", "POST"],
      credentials: false,
    },
    maxHttpBufferSize: 100_000,
    perMessageDeflate: false,
  });

  io.on("connection", (_socket) => {
    // não precisa joinMatch
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
