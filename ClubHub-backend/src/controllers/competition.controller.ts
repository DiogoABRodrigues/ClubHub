import { Request, Response } from "express";
import CompetitionService from "../services/competition.service";

const service = new CompetitionService();

export default class CompetitionController {
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

  static async updateLegend(req: Request, res: Response) {
    const competitionId = parseInt(String(req.params.competitionId));
    const { legend } = req.body; // [{ color: "#47d406", label: "Promoção" }]

    try {
      const data = await service.updateLegend(competitionId, legend);
      res.json(data);
    } catch (err) {
      console.error("Erro a atualizar legenda:", err);
      res.status(500).json({ error: "Erro a atualizar legenda" });
    }
  }
}
