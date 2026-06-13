import { io } from "socket.io-client";
import { teamConfig } from "../config/teamConfig";

export const socket = io(teamConfig.backend_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
