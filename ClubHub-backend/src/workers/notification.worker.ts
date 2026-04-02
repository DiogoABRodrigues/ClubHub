import { notificationQueue } from "../queues/notification.queue";
import pushService from "../services/push.service";

// 🔥 processa jobs da queue
notificationQueue.process(async (job : any) => {
  const { devices, payload } = job.data;

  console.log("📨 Sending push notifications...");

  const tickets = await pushService.sendToDevices(devices, payload);

  await pushService.handleReceipts(tickets);

  return true;
});