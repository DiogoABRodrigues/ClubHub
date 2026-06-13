import { Request, Response } from "express";
import HelperService from "../services/helper.service";

const service = new HelperService();

export default class HelperController {
  static async getAllCategoriesAvailable(req: Request, res: Response) {
    const data = await service.getAllCategoriesAvailble();
    res.json(data);
  }
}
