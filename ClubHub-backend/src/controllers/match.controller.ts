import { Request, Response } from "express";
import MatchService from "../services/match.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new MatchService();

export default class MatchController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAll();
    res.json(data);
  });

  static getBySeasonId = asyncHandler(async (req: Request, res: Response) => {
    const seasonId = Number(req.params.seasonId);
    const category = String(req.query.category ?? "over19");
    const data = await service.getBySeasonId(seasonId, category);
    res.json(data);
  });

  static getByCurrentSeasonId = asyncHandler(async (req: Request, res: Response) => {
    const category = String(req.query.category ?? "over19");
    const data = await service.getByCurrentSeasonId(category);
    res.json(data);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.create(req.body);
    res.status(201).json(data);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await service.update(id, req.body);
    res.json(data);
  });

  static updateDateTime = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { date, time } = req.body;
    const data = await service.updateDateTime(id, date, time);
    res.json(data);
  });

  static updateScore = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { result } = req.body;
    const data = await service.updateScore(id, result);
    res.json(data);
  });

  static updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { location } = req.body;
    const data = await service.updateLocation(id, location);
    res.json(data);
  });

  static updateEvents = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { events } = req.body;
    const data = await service.updateEvents(id, events);
    res.json(data);
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const data = await service.updateStatus(id, status);
    res.json(data);
  });

  static updateOutcome = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { outcome } = req.body;
    const data = await service.updateOutcome(id, outcome);
    res.json(data);
  });
}
