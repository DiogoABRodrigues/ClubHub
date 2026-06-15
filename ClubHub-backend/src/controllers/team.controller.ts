import { Request, Response } from "express";
import TeamService from "../services/team.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new TeamService();

export default class TeamController {
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAll();
    res.json(data);
  });

  static getByName = asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.name;
    const data = await service.getByName(String(name));
    res.json(data);
  });
}
