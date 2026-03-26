import { Request, Response } from "express";
import SquadService from "../services/squad.service";

const service = new SquadService();

export default class SquadController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  static async getBySeasonId(req: Request, res: Response) {
    const seasonId = parseInt(String(req.params.seasonId));
    const data = await service.getBySeasonId(seasonId);
    res.json(data);
  }

  static async getByCurrentSeasonId(req: Request, res: Response) {
    const data = await service.getByCurrentSeasonId();
    res.json(data);
  }
}