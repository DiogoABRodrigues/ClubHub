import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

class MeController {
  me = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
      user: (req as any).user,
    });
  });
}

export default new MeController();
