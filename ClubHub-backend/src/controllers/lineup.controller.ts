import { Request, Response } from "express";
import LineupService from "../services/lineup.service";

const service = new LineupService();

export default class LineupController {
  static async getAll(req: Request, res: Response) {
    const matchId = req.query.matchId ? Number(req.query.matchId) : undefined;
    const data = await service.getAll(matchId);
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json(data);
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await service.update(id, req.body);
    res.json(data);
  }

  static async deleteByMatch(req: Request, res: Response) {
    const matchId = Number(req.query.matchId);
    await service.deleteByMatch(matchId);
    res.status(204).send();
  }
}
