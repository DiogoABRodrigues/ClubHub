import { io } from "socket.io-client";

export const socket = io("http://192.168.1.105:3000", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});