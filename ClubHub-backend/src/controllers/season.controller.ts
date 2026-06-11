import { Request, Response } from "express";
import SeasonService from "../services/season.service";

const service = new SeasonService();

export default class SeasonController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  static async getBySeasonId(req: Request, res: Response) {
    const seasonId = parseInt(String(req.params.seasonId));
    const data = await service.getById(seasonId);
    res.json(data);
  }

  static async getByCurrentSeasonId(req: Request, res: Response) {
    const data = await service.getCurrentSeason();
    res.json(data);
  }

  static async getByCategory(req: Request, res: Response) {
    const { category } = req.params as { category: string };
    if (!category) return res.status(400).json({ error: "Missing category" });
    const data = await service.getByCategory(category);
    res.json(data);
  }
}