import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";

class NotificationController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body || typeof req.body !== "object") {
      throw new AppError(
        "Body JSON obrigatorio. Confirma que o header Content-Type e application/json.",
        400,
      );
    }

    const { title, body, type } = req.body;
    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof type !== "string" ||
      !title.trim() ||
      !body.trim() ||
      !type.trim()
    ) {
      throw new AppError("Campos obrigatorios: title, body e type.", 400);
    }

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
