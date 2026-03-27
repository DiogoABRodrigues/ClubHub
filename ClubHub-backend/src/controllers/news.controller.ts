import { Request, Response } from "express";
import newsService from "../services/news.service";

class NewsController {
  async create(req: Request, res: Response) {
    try {
      const news = await newsService.create({
        ...req.body,
        image: req.file?.filename, 
      });

      return res.status(201).json(news);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar notícia", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const news = await newsService.getAll();
      return res.json(news);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar notícias" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const updated = await newsService.update(id, {
        ...req.body,
        ...(req.file && { image: req.file.filename }),
      });

      if (!updated) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar notícia" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const deleted = await newsService.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }

      return res.json({ message: "Notícia eliminada com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao eliminar notícia" });
    }
  }
}

export default new NewsController();