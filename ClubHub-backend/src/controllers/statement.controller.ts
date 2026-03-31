import { Request, Response } from "express";
import StatementService from "../services/statement.service";

class StatementController {
  async create(req: Request, res: Response) {
    try {
      const statement = await StatementService.createStatement(
        req.body,
      );
      res.status(201).json(statement);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const statement = await StatementService.updateStatement(
        Number(id),
        req.body,
      );
      res.status(200).json(statement);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getActiveStatements(req: Request, res: Response) {
    try {
      const statements = await StatementService.getActiveStatements();
      res.status(200).json(statements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new StatementController();
