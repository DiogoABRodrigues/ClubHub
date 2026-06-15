import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { userName, password } = req.body;
    const tokens = await AuthService.login(userName, password);
    return res.status(200).json(tokens);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token obrigatório" });
    }
    const tokens = await AuthService.refresh(refreshToken);
    return res.status(200).json(tokens);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await AuthService.logout(userId);
    return res.status(200).json({ message: "Logout efetuado" });
  });

  wakeUp = asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json({ message: "API a funcionar" });
  });
}

export default new AuthController();
