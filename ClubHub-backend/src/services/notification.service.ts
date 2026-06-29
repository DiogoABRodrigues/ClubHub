import Notification from "../models/Notification";
import { pushService } from "./push.service";
import deviceService from "./device.service";

class NotificationService {
  async create(data: { title: string; body: string; type: string }) {
    await this.notify(data);
    return Notification.create(data);
  }

  private async notify(notification: { title: string; body: string }) {
    const devices = await deviceService.getAllDevices();

    if (!devices.length) return;

    const response = await pushService.sendToDevices(devices, {
      title: notification.title,
      body: notification.body,
    });

    await pushService.handleReceipts(response);
  }

  async findAll() {
    return await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number) {
    return await Notification.findByPk(id);
  }

  async delete(id: number) {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    await notification.destroy();
    return true;
  }
}

export default new NotificationService();
