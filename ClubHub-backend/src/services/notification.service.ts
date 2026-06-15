import Notification from "../models/Notification";
import { pushService } from "./push.service";
import deviceService from "./device.service";

class NotificationService {
  async create(data: { title: string; body: string; type: string }) {
    const notification = await Notification.create(data);
    await this.notify(notification);
    return notification;
  }

  private async notify(news: any) {
    const devices = await deviceService.getAllDevices();

    if (!devices.length) return;

    const response = await pushService.sendToDevices(devices, {
      title: news.title,
      body: news.body,
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
