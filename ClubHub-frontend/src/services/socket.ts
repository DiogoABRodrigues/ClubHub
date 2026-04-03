import { io } from "socket.io-client";

export const socket = io(process.env.BACKEND_URI, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});
