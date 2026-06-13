import { Request, Response } from "express";
import PlayerService from "../services/player.service";

const service = new PlayerService();

export default class PlayerController {
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

  static async getAllBySeasonId(req: Request, res: Response) {
    const seasonId = parseInt(String(req.params.seasonId));
    const category = String(req.query.category ?? "over19");
    const data = await service.getAllBySeasonId(seasonId, category);
    res.json(data);
  }

  static async getAllStatsByPlayerId(req: Request, res: Response) {
    const playerId = parseInt(String(req.params.playerId));
    const data = await service.getAllStatsByPlayerId(playerId);
    if (!data) return res.status(404).json({ error: "Jogador não encontrado" });
    res.json(data);
  }

  static async updatePlayer(req: Request, res: Response) {
    const playerId = parseInt(String(req.params.playerId));
    try {
      const updatedPlayer = await service.updatePlayer(playerId, req.body);
      res.json(updatedPlayer);
    } catch (err) {
      res.status(500).json({ error: "Erro a atualizar jogador" });
    }
  }
}
