import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // vem do authMiddleware

    if (!user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const allowed =
      roles.includes(user.role) ||
      (user.role === "super_admin" && roles.includes("admin"));

    if (!allowed) {
      return res.status(403).json({ message: "Sem permissão para aceder" });
    }

    next();
  };
};
