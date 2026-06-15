import { Request, Response } from "express";
import SeasonService from "../services/season.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new SeasonService();

export default class SeasonController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAll();
    res.json(data);
  });

  static getBySeasonId = asyncHandler(async (req: Request, res: Response) => {
    const seasonId = parseInt(String(req.params.seasonId));
    const data = await service.getById(seasonId);
    res.json(data);
  });

  static getByCurrentSeasonId = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getCurrentSeason();
    res.json(data);
  });

  static getByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params as { category: string };
    if (!category) return res.status(400).json({ error: "Missing category" });
    const data = await service.getByCategory(category);
    res.json(data);
  });
}
