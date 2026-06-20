import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHash } from "crypto";
import Admin from "../models/Admin";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const DUMMY_PASSWORD_HASH =
  "$2b$10$7QJ0YkYhzxSUtJXvG2Pf4e6V/Po1NXBqX6gYV.d1ZPWXyK9gK6f6K";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

class AuthService {
  generateAccessToken(user: { id: number; role: string }) {
    return jwt.sign(user, env.JWT_ACCESS_SECRET, {
      algorithm: "HS256",
      expiresIn: "15m",
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      subject: String(user.id),
    });
  }

  generateRefreshToken(user: { id: number; role: string }) {
    return jwt.sign(user, env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      subject: String(user.id),
    });
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        algorithms: ["HS256"],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      }) as { id: number; role: string };
    } catch {
      throw new AppError("Refresh token invalido", 401);
    }
  }

  async login(userName: string, password: string) {
    if (
      typeof userName !== "string" ||
      typeof password !== "string" ||
      userName.length < 1 ||
      userName.length > 100 ||
      password.length < 8 ||
      password.length > 200
    ) {
      throw new AppError("Credenciais invalidas", 401);
    }

    const normalizedUserName = userName.trim();
    const admin = await Admin.findOne({ where: { userName: normalizedUserName } });
    const invalid = "Credenciais invalidas";

    if (!admin) {
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
      throw new AppError(invalid, 401);
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new AppError(invalid, 401);

    const payload = { id: admin.id, role: admin.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    admin.refreshToken = hashToken(refreshToken);
    await admin.save();

    return { accessToken, refreshToken };
  }

  async refresh(oldToken: string) {
    if (typeof oldToken !== "string" || oldToken.length > 4096) {
      throw new AppError("Refresh token invalido", 401);
    }

    const decoded = this.verifyRefreshToken(oldToken);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin || admin.refreshToken !== hashToken(oldToken)) {
      throw new AppError("Refresh token invalido", 401);
    }

    const payload = { id: admin.id, role: admin.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    admin.refreshToken = hashToken(refreshToken);
    await admin.save();

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    const admin = await Admin.findByPk(userId);
    if (admin) {
      admin.refreshToken = null;
      await admin.save();
    }
  }
}

export default new AuthService();
