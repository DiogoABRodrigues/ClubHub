import { Request, Response } from "express";
import TeamService from "../services/team.service";

const service = new TeamService();

export default class TeamController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  static async getByName(req: Request, res: Response) {
    const name = req.params.name;
    const data = await service.getByName(String(name));
    res.json(data);
  }
}
