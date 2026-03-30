import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin";

const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP = "7d";
const SECRET_KEY = process.env.JWT_SECRET || "changeme";

class AuthService {
  generateAccessToken(user: { id: number; role: string }) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXP });
  }

  generateRefreshToken(user: { id: number; role: string }) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXP });
  }

  verifyToken(token: string) {
    return jwt.verify(token, SECRET_KEY) as { id: number; role: string };
  }

  async login(email: string, password: string) {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) throw new Error("Utilizador não encontrado");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error("Password inválida");

    const payload = { id: admin.id, role: admin.roleId.toString() };
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}

export default new AuthService();
