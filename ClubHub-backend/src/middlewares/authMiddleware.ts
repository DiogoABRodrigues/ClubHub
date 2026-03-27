import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = AuthService.verifyToken(token) as { id: number; role: string };
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Não autenticado" });
    if (!roles.includes(user.role)) return res.status(403).json({ message: "Sem permissão" });
    next();
  };
};