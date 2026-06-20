import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nao fornecido" });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: "Token nao fornecido" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    if (
      typeof decoded !== "object" ||
      typeof decoded.id !== "number" ||
      !["admin", "super_admin"].includes(String(decoded.role))
    ) {
      throw new Error("Invalid token payload");
    }

    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido" });
  }
}
