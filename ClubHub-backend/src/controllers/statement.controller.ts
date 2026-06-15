import { Request, Response } from "express";
import StatementService from "../services/statement.service";
import { asyncHandler } from "../utils/asyncHandler";

class StatementController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const statement = await StatementService.createStatement(req.body);
    res.status(201).json(statement);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const statement = await StatementService.updateStatement(Number(id), req.body);
    res.status(200).json(statement);
  });

  getActiveStatements = asyncHandler(async (_req: Request, res: Response) => {
    const statement = await StatementService.getActiveStatement();
    res.status(200).json(statement);
  });

  deleteStatement = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await StatementService.deleteStatement(Number(id));
    res.status(204).send();
  });
}

export default new StatementController();
