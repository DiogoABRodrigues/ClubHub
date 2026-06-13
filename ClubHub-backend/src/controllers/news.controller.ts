import { Request, Response } from "express";
import newsService from "../services/news.service";
import { uploadToSupabase } from "../middlewares/upload";

class NewsController {
  async create(req: Request, res: Response) {
    try {
      const imageUrl = await uploadToSupabase(req);

      const news = await newsService.create({
        ...req.body,
        image: imageUrl ?? req.body.image ?? null,
      });

      return res.status(201).json(news);
    } catch (error) {
      console.error("Erro ao criar notícia:", error);
      return res.status(500).json({ message: "Erro ao criar notícia" });
    }
  }

  async update(req: Request, res: Response) {
    try {
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
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      return res.status(500).json({ message: "Erro ao atualizar notícia" });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      return res.json(await newsService.getAll());
    } catch {
      return res.status(500).json({ message: "Erro ao buscar notícias" });
    }
  }

  async getLast10(_req: Request, res: Response) {
    try {
      return res.json(await newsService.getLast10());
    } catch {
      return res.status(500).json({ message: "Erro ao buscar notícias" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await newsService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }
      return res.json({ message: "Notícia eliminada com sucesso" });
    } catch {
      return res.status(500).json({ message: "Erro ao eliminar notícia" });
    }
  }
}

export default new NewsController();
