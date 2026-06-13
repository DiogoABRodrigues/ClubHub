import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

class AuthService {
  generateAccessToken(user: { id: number; role: string }) {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(user: { id: number; role: string }) {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET) as { id: number; role: string };
  }

  async login(userName: string, password: string) {
    const admin = await Admin.findOne({ where: { userName } });

    // Mensagem genérica para não revelar se o utilizador existe ou não
    const INVALID = "Credenciais inválidas";

    if (!admin) throw new Error(INVALID);

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error(INVALID);

    const payload = { id: admin.id, role: admin.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    admin.refreshToken = refreshToken;
    await admin.save();

    return { accessToken, refreshToken };
  }

  async refresh(oldToken: string) {
    const decoded = this.verifyRefreshToken(oldToken);

    const admin = await Admin.findByPk(decoded.id);
    if (!admin || admin.refreshToken !== oldToken) {
      throw new Error("Refresh token inválido");
    }

    const payload = { id: admin.id, role: admin.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    admin.refreshToken = refreshToken;
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
