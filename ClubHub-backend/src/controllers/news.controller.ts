import { Request, Response } from "express";
import newsService from "../services/news.service";
import { uploadToSupabase } from "../middlewares/upload";
import { asyncHandler } from "../utils/asyncHandler";

class NewsController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const imageUrl = await uploadToSupabase(req);
    const news = await newsService.create({
      ...req.body,
      image: imageUrl ?? req.body.image ?? null,
    });
    return res.status(201).json(news);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const imageUrl = await uploadToSupabase(req);
    const updated = await newsService.update(id, {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });
    if (!updated) {
      return res.status(404).json({ message: "Notícia não encontrada" });
    }
    return res.json(updated);
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    return res.json(await newsService.getAll());
  });

  getLast10 = asyncHandler(async (_req: Request, res: Response) => {
    return res.json(await newsService.getLast10());
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await newsService.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Notícia não encontrada" });
    }
    return res.json({ message: "Notícia eliminada com sucesso" });
  });
}

export default new NewsController();
