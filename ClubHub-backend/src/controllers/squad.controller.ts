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
    const category = String(req.query.category ?? "over19");
    const data = await service.getBySeasonId(seasonId, category);
    res.json(data);
  }

  static async getByCurrentSeasonId(req: Request, res: Response) {
    const category = String(req.query.category ?? "over19");
    const data = await service.getByCurrentSeasonId(category);
    res.json(data);
  }

  static async updateStatus(req: Request, res: Response) {
    const playerExternalId = parseInt(String(req.params.playerExternalId));
    const seasonId = parseInt(String(req.params.seasonId));
    const { status, category = "over19" } = req.body;

    if (!["active", "left", "error"].includes(status)) {
      res.status(400).json({ error: "Status inválido. Use: active | left | error" });
      return;
    }

    const entry = await service.updateStatus(playerExternalId, seasonId, status, category);
    res.json(entry);
  }
}