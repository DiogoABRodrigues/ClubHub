import { Request, Response } from "express";
import notificationService from "../services/notification.service";

class NotificationController {
  async create(req: Request, res: Response) {
    try {
      const { title, body, type } = req.body;

      const notification = await notificationService.create({
        title,
        body,
        type,
      });

      return res.status(201).json(notification);
    } catch (error) {
      return res.status(500).json({ error: "Error creating notification" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const notifications = await notificationService.findAll();
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching notifications" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notification = await notificationService.findById(Number(id));

      if (!notification) {
        return res.status(404).json({ error: "Not found" });
      }

      return res.json(notification);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching notification" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await notificationService.delete(Number(id));

      return res.json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting notification" });
    }
  }
}

export default new NotificationController();