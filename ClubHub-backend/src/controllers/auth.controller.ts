import { Request, Response } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;

      const tokens = await AuthService.login(userName, password);

      return res.status(200).json(tokens);
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token obrigatório" });
      }

      const tokens = await AuthService.refresh(refreshToken);

      return res.status(200).json(tokens);
    } catch (err: any) {
      return res.status(403).json({ message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      await AuthService.logout(userId);

      return res.status(200).json({ message: "Logout efetuado" });
    } catch {
      return res.status(500).json({ message: "Erro no logout" });
    }
  }

  async wakeUp(req: Request, res: Response) {
    return res.status(200).json({ message: "API a funcionar" });
  }
}

export default new AuthController();
