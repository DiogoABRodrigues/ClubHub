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
}