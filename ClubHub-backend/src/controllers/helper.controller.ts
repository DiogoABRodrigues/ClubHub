import { Request, Response } from "express";
import HelperService from "../services/helper.service";
import { asyncHandler } from "../utils/asyncHandler";

const service = new HelperService();

export default class HelperController {
  static getAllCategoriesAvailable = asyncHandler(async (_req: Request, res: Response) => {
    const data = await service.getAllCategoriesAvailble();
    res.json(data);
  });
}
