import { Request, Response } from "express";
import StandingService from "../services/standing.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new StandingService();

export default class StandingController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAll();
    res.json(data);
  });

  static getBySeasonId = asyncHandler(async (req: Request, res: Response) => {
    const seasonId = parseInt(String(req.params.seasonId));
    const category = String(req.query.category ?? "over19");
    const data = await service.getBySeasonId(seasonId, category);
    res.json(data);
  });

  static getByCurrentSeasonId = asyncHandler(async (req: Request, res: Response) => {
    const category = String(req.query.category ?? "over19");
    const data = await service.getByCurrentSeasonId(category);
    res.json(data);
  });
}
