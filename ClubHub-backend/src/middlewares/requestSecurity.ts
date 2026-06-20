import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function containsForbiddenKey(value: unknown, depth = 0): boolean {
  if (depth > 20 || value === null || typeof value !== "object") return false;

  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key) || containsForbiddenKey(child, depth + 1)) {
      return true;
    }
  }
  return false;
}

export function requestSecurity(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.originalUrl.length > 2048) {
    return next(new AppError("URL demasiado longo.", 414));
  }

  if (
    containsForbiddenKey(req.body) ||
    containsForbiddenKey(req.params) ||
    containsForbiddenKey(req.query)
  ) {
    return next(new AppError("Pedido invalido.", 400));
  }

  return next();
}
