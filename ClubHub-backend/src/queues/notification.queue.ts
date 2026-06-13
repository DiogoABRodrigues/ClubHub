import Bull from "bull";

export const notificationQueue = new Bull("notifications", {
  redis: process.env.REDIS_URL!,
});
