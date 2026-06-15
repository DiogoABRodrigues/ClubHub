import { Request, Response } from "express";
import CompetitionService from "../services/competition.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new CompetitionService();

export default class CompetitionController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAll();
    res.json(data);
  });

  static getBySeasonId = asyncHandler(async (req: Request, res: Response) => {
    const seasonId = parseInt(String(req.params.seasonId));
    const data = await service.getBySeasonId(seasonId);
    res.json(data);
  });

  static getByCurrentSeasonId = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getByCurrentSeasonId();
    res.json(data);
  });

  static updateLegend = asyncHandler(async (req: Request, res: Response) => {
    const competitionId = parseInt(String(req.params.competitionId));
    const { legend } = req.body;
    const data = await service.updateLegend(competitionId, legend);
    res.json(data);
  });
}
