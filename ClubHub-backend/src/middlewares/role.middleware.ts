import { Request, Response, NextFunction } from "express";

export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    const allowed =
      user &&
      (roles.includes(user.role) ||
        (user.role === "super_admin" && roles.includes("admin")));

    if (!allowed) {
      return res.status(403).json({ message: "Sem permissões" });
    }

    return next();
  };
}
