import { Request, Response } from "express";
import NotificationService from "../services/notification.service";

class NotificationController {
  async create(req: Request, res: Response) {
    try {
      const notification = await NotificationService.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.updateNotification(Number(id), req.body);
      res.status(200).json(notification);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const notifications = await NotificationService.getAllNotifications();
      res.status(200).json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new NotificationController();