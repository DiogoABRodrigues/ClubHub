import { Request, Response } from "express";
import PlayerService from "../services/player.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new PlayerService();

export default class PlayerController {
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

  static getAllBySeasonId = asyncHandler(async (req: Request, res: Response) => {
    const seasonId = parseInt(String(req.params.seasonId));
    const category = String(req.query.category ?? "over19");
    const data = await service.getAllBySeasonId(seasonId, category);
    res.json(data);
  });

  static getAllStatsByPlayerId = asyncHandler(async (req: Request, res: Response) => {
    const playerId = parseInt(String(req.params.playerId));
    const data = await service.getAllStatsByPlayerId(playerId);
    if (!data) return res.status(404).json({ error: "Jogador não encontrado" });
    res.json(data);
  });

  static updatePlayer = asyncHandler(async (req: Request, res: Response) => {
    const playerId = parseInt(String(req.params.playerId));
    const updatedPlayer = await service.updatePlayer(playerId, req.body);
    res.json(updatedPlayer);
  });
}
