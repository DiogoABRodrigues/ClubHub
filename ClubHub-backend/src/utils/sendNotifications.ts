import pushService from "../services/push.service";
import deviceService from "../services/device.service";

async function sendGoalNotification() {
  const devices = await deviceService.getDevicesForGoals();

  const tickets = await pushService.sendToDevices(devices, {
    title: "GOLO ⚽",
    body: "A tua equipa marcou!",
  });

  setTimeout(async () => {
    await pushService.handleReceipts(tickets);
  }, 5000);
}