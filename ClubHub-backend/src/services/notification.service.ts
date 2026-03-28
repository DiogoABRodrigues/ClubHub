// backend/services/notification.service.ts
import Notification from "../models/Notification";
import NotificationPreference from "../models/NotificationPreference";
import { fcm } from "../config/firebase";
import Device from "../models/Device";

class NotificationService {
  async createNotification(data: Partial<Notification>) {
    const notification = await Notification.create(data);

    // Enviar push notification para devices com preferência de news
    // await this.sendNewsNotification(notification.title, notification.id.toString());

    return notification;
  }

  async updateNotification(id: number, data: Partial<Notification>) {
    const notification = await Notification.findByPk(id);
    if (!notification) throw new Error("Notification not found");
    return await notification.update(data);
  }

  async getAllNotifications() {
    return await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getNotificationById(id: number) {
    return await Notification.findByPk(id);
  }

  // === Novo método para envio de push notifications ===
  /*private async sendNewsNotification(title: string, newsId: string) {
    const prefs = await NotificationPreference.findAll({
      where: { news: true },
      include: ["Device"],
    });

    const tokens = prefs.map(p => p.Device.pushToken);
    if (!tokens.length) return;

    await fcm.sendMulticast({
      tokens,
      notification: { title: "Nova notícia!", body: title },
      data: { newsId },
    });
  }*/
}

export default new NotificationService();