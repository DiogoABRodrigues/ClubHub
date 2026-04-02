import Bull from "bull";
import redis from "../config/redis";

export const notificationQueue = new Bull("notifications", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});