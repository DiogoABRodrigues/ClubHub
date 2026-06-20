import { createHmac, timingSafeEqual } from "crypto";
import { Request, Response } from "express";
import deviceService from "../services/device.service";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const BOOLEAN_FIELDS = [
  "news",
  "over19_goals",
  "over19_matchday",
  "over19_result",
  "sub19_goals",
  "sub19_matchday",
  "sub19_result",
  "sub17_goals",
  "sub17_matchday",
  "sub17_result",
  "sub15_goals",
  "sub15_matchday",
  "sub15_result",
  "sub13_goals",
  "sub13_matchday",
  "sub13_result",
] as const;

function deviceAccessToken(id: string): string {
  return createHmac("sha256", env.JWT_REFRESH_SECRET)
    .update(`device:${id}`)
    .digest("base64url");
}

function hasValidDeviceToken(req: Request, id: string): boolean {
  const supplied = req.header("x-device-token");
  if (!supplied) return false;

  const expected = Buffer.from(deviceAccessToken(id));
  const actual = Buffer.from(supplied);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function validateId(id: unknown): id is string {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{8,128}$/.test(id);
}

function preferencesFrom(body: Record<string, unknown>) {
  const preferences: Record<string, boolean> = {};
  for (const field of BOOLEAN_FIELDS) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") {
        throw new AppError(`Campo invalido: ${field}`, 400);
      }
      preferences[field] = body[field] as boolean;
    }
  }
  return preferences;
}

function publicDevice(device: any) {
  const json = device.toJSON ? device.toJSON() : device;
  const { pushToken: _pushToken, ...safe } = json;
  return safe;
}

class DeviceController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { id, pushToken, platform } = req.body;
    if (
      !validateId(id) ||
      typeof pushToken !== "string" ||
      pushToken.length < 20 ||
      pushToken.length > 4096 ||
      !["android", "ios"].includes(platform)
    ) {
      throw new AppError("Dados de dispositivo invalidos", 400);
    }

    const existing = await deviceService.getDeviceById(id);
    const isLegacyClaim =
      existing && !req.header("x-device-token") && existing.pushToken === pushToken;
    if (existing && !isLegacyClaim && !hasValidDeviceToken(req, id)) {
      throw new AppError("Dispositivo nao autorizado", 403);
    }

    const device = await deviceService.upsertDevice({
      id,
      pushToken,
      platform,
      ...preferencesFrom(req.body),
    } as any);

    return res.json({
      device: publicDevice(device),
      deviceAccessToken: deviceAccessToken(id),
    });
  });

  updatePreferences = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    if (!validateId(id)) throw new AppError("ID de dispositivo invalido", 400);
    if (!hasValidDeviceToken(req, id)) {
      throw new AppError("Dispositivo nao autorizado", 403);
    }

    const updatedRows = await deviceService.updatePreferences(
      id,
      preferencesFrom(req.body) as any,
    );
    if (!updatedRows) throw new AppError("Dispositivo nao encontrado", 404);
    return res.json({ success: true });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    if (!validateId(id)) throw new AppError("ID de dispositivo invalido", 400);
    if (!hasValidDeviceToken(req, id)) {
      throw new AppError("Dispositivo nao autorizado", 403);
    }

    const device = await deviceService.getDeviceById(id);
    if (!device) throw new AppError("Dispositivo nao encontrado", 404);
    return res.json(publicDevice(device));
  });
}

export default new DeviceController();
