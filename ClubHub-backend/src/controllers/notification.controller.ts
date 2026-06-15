import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { asyncHandler } from "../utils/asyncHandler";

class NotificationController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { title, body, type } = req.body;
    const notification = await notificationService.create({ title, body, type });
    return res.status(201).json(notification);
  });

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const notifications = await notificationService.findAll();
    return res.json(notifications);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await notificationService.findById(Number(id));
    if (!notification) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json(notification);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await notificationService.delete(Number(id));
    return res.json({ message: "Deleted successfully" });
  });
}

export default new NotificationController();
