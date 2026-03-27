import Notification from "../models/Notification";

class NotificationService {
  async createNotification(data: Partial<Notification>) {
    return await Notification.create(data);
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
}

export default new NotificationService();