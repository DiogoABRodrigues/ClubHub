import { Request, Response } from "express";
import newsService from "../services/news.service";

const baseUrl = process.env.API_BASE_URL

class NewsController {
  async create(req: Request, res: Response) {
    try {
      console.log("File received:", req.file); // Debug
      console.log("Body received:", req.body); // Debug

      // Verifica se o arquivo foi recebido corretamente
      let imageFilename = null;
      if (req.file) {
        imageFilename = req.file.filename;
      } else if (req.body.image) {
        // Se não veio como arquivo, mas veio como string no body
        imageFilename = req.body.image;
      }

      const news = await newsService.create({
        ...req.body,
        image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null,
      });

      return res.status(201).json(news);
    } catch (error) {
      console.error("Erro ao criar notícia:", error);
      return res.status(500).json({ message: "Erro ao criar notícia", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      let imageFilename = undefined;
      if (req.file) {
        imageFilename = req.file.filename;
      } else if (req.body.image) {
        imageFilename = req.body.image;
      }

      const updateData = {
        ...req.body,
        ...(req.file && {
          image: `${baseUrl}/uploads/${req.file.filename}`,
        }),
      };

      // Remove o campo image do body se ele existir como string
      if (updateData.image === "[object Object]") {
        delete updateData.image;
      }

      const updated = await newsService.update(id, updateData);

      if (!updated) {
        return res.status(404).json({ message: "Notícia não encontrada" });
      }

      return res.json(updated);
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      return res.status(500).json({ message: "Erro ao atualizar notícia" });
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

  async getLast10(req: Request, res: Response) {
    try {
      const news = await newsService.getLast10();
      return res.json(news);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar notícias" });
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
