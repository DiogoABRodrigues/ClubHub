import { Request, Response } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      res.status(200).json(tokens);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: "Refresh token obrigatório" });

      const decoded = AuthService.verifyToken(refreshToken);
      const accessToken = AuthService.generateAccessToken({
        id: decoded.id,
        role: decoded.role,
      });

      res.status(200).json({ accessToken });
    } catch (err: any) {
      res.status(403).json({ message: "Refresh token inválido ou expirado" });
    }
  }
}

export default new AuthController();
