import { Request, Response } from "express";
import PlayerService from "../services/player.service";

const service = new PlayerService();

export default class PlayerController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const seasonId = parseInt(String(req.params.seasonId));
    const data = await service.getBySeasonId(seasonId);
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

  static async getAllStatsByPlayerId(req: Request, res: Response) {
    const playerId = parseInt(String(req.params.playerId));
    const data = await service.getAllStatsByPlayerId(playerId);
    if (!data) return res.status(404).json({ error: "Jogador não encontrado" });
    res.json(data);
  }

  static async updatePlayer(req: Request, res: Response) {
    const playerId = parseInt(String(req.params.playerId));
    const updates = req.body;

    try {
      const updatedPlayer = await service.updatePlayer(playerId, updates);
      res.json(updatedPlayer);
    } catch (err) {
      console.error("Erro a atualizar jogador:", err);
      res.status(500).json({ error: "Erro a atualizar jogador" });
    }
  }
}