import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { AppError } from "../errors/AppError";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(
    new AppError(`Rota nao encontrada: ${req.method} ${req.originalUrl}`, 404),
  );
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: "Erro de validacao.",
      details: error.errors.map((item) => item.message),
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
}
