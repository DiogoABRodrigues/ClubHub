import { Request, Response } from "express";

class MeController {
  async me(req: Request, res: Response) {
    try {
      return res.status(200).json({
        user: (req as any).user,
      });
    } catch {
      return res.status(500).json({ message: "Erro ao obter utilizador" });
    }
  }
}

export default new MeController();
