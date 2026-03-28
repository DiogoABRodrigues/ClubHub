import { Request, Response } from "express";
import MatchService from "../services/match.service";

const service = new MatchService();

export default class MatchController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  static async getBySeasonId(req: Request, res: Response) {
    const seasonId = Number(req.params.seasonId);
    const data = await service.getBySeasonId(seasonId);
    res.json(data);
  }

  static async getByCurrentSeasonId(req: Request, res: Response) {
    const data = await service.getByCurrentSeasonId();
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

  static async updateDateTime(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { date, time } = req.body;

    const data = await service.updateDateTime(id, date, time);

    res.json(data);
  }

  static async updateScore(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { result } = req.body;

    const data = await service.updateScore(id, result);

    res.json(data);
  }

  static async updateLocation(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { location } = req.body;

    const data = await service.updateLocation(id, location);

    res.json(data);
  }

  static async updateEvents(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { events } = req.body;

    const data = await service.updateEvents(id, events);

    res.json(data);
  }

  static async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;

    const data = await service.updateStatus(id, status);

    res.json(data);
  }

  static async updateOutcome(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { outcome } = req.body;

    const data = await service.updateOutcome(id, outcome);

    res.json(data);
  }
}