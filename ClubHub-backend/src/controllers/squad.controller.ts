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

  /**
   * PATCH /squad/:playerExternalId/season/:seasonId/status
   * Body: { status: "active" | "left" | "error" }
   * Admin only — atualiza o status de um jogador naquele squad/época.
   */
  static async updateStatus(req: Request, res: Response) {
    const playerExternalId = parseInt(String(req.params.playerExternalId));
    const seasonId = parseInt(String(req.params.seasonId));
    const { status } = req.body;

    if (!["active", "left", "error"].includes(status)) {
      res.status(400).json({ error: "Status inválido. Use: active | left | error" });
      return;
    }

    const entry = await service.updateStatus(playerExternalId, seasonId, status);
    res.json(entry);
  }
}
