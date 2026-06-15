import { Request, Response } from "express";
import path from "path";
import { randomUUID } from "crypto";
import feedbackService from "../services/feedback.service";
import { supabase } from "../lib/supabase";
import { asyncHandler } from "../utils/asyncHandler";

const BUCKET = process.env.SUPABASE_BUCKET ?? "uploads";

async function uploadFeedbackImage(
  req: Request & { file?: Express.Multer.File },
  type: "suggestion" | "bug",
): Promise<string | null> {
  if (!req.file) return null;

  const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
  const prefix = type === "suggestion" ? "sugestao" : "bug";
  const filename = `${prefix}_${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload falhou: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

class FeedbackController {
  /** POST /api/feedback - público */
  create = asyncHandler(async (req: Request, res: Response) => {
    const { type, message, deviceId } = req.body;

    if (!type || !["suggestion", "bug"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Campo 'type' inválido. Use 'suggestion' ou 'bug'." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ message: "Campo 'message' é obrigatório." });
    }

    const imageUrl = await uploadFeedbackImage(req, type);

    const feedback = await feedbackService.create({
      type,
      message: message.trim(),
      imageUrl,
      deviceId: deviceId ?? null,
    });

    return res.status(201).json(feedback);
  });

  /** GET /api/feedback - apenas admin */
  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const feedbacks = await feedbackService.findAll();
    return res.json(feedbacks);
  });
}

export default new FeedbackController();
