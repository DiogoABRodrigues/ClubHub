import { Request, Response } from "express";
import service from "../services/matchEvent.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createMatchEvent = asyncHandler(async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const event = await service.createEvent(Number(matchId), req.body);
  return res.json(event);
});

export const updateMatchEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await service.updateEvent(Number(id), req.body);
  return res.json(event);
});

export const deleteMatchEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await service.deleteEvent(Number(id));
  return res.json({ success: true });
});
