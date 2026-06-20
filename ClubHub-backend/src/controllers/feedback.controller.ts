import { Request, Response } from "express";
import feedbackService from "../services/feedback.service";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToSupabase } from "../middlewares/upload";

class FeedbackController {
  /** POST /api/feedback - público */
  create = asyncHandler(async (req: Request, res: Response) => {
    const { type, message, deviceId } = req.body;

    if (!type || !["suggestion", "bug"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Campo 'type' inválido. Use 'suggestion' ou 'bug'." });
    }
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 5000
    ) {
      return res
        .status(400)
        .json({ message: "Campo 'message' é obrigatório." });
    }

    if (
      deviceId !== undefined &&
      deviceId !== null &&
      (typeof deviceId !== "string" ||
        !/^[a-zA-Z0-9_-]{8,128}$/.test(deviceId))
    ) {
      return res.status(400).json({ message: "Device ID invalido." });
    }

    const imageUrl = await uploadToSupabase(req);

    const feedback = await feedbackService.create({
      type,
      message: message.trim(),
      imageUrl,
      deviceId: deviceId ?? null,
    });

    return res.status(201).json(feedback);
  });

  /** GET /api/feedback - apenas admin */
  findAll = asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const feedbacks = await feedbackService.findAll(limit, offset);
    return res.json(feedbacks);
  });
}

export default new FeedbackController();
