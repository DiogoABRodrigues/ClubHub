import Bull from "bull";

export const notificationQueue = new Bull("notifications", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});
