import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import teamRoutes from "./routes/team.routes";
import playerRoutes from "./routes/player.routes";
import competitionRoutes from "./routes/competition.routes";
import matchRoutes from "./routes/match.routes";
import lineupRoutes from "./routes/lineup.routes";
import seasonRoutes from "./routes/season.routes";
import statsRoutes from "./routes/stats.routes";
import standingRoutes from "./routes/standing.routes";
import squadRoutes from "./routes/squad.routes";
import newsRoutes from "./routes/news.routes";
import statementRoutes from "./routes/statement.routes";
import scraperRoutes from "./routes/scraper.routes";
import matchEventRoutes from "./routes/matchEvent.routes";
import deviceRoutes from "./routes/device.routes";
import authRoutes from "./routes/auth.routes";
import appSettingsRoutes from "./routes/appSettings.routes";
import notificationsRoutes from "./routes/notification.routes";
import feedbackRoutes from "./routes/feedback.routes";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helperRoutes from "./routes/helper.routes";

// ─── Logger ───────────────────────────────────────────────────────────────────
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(process.env.NODE_ENV !== "production" && {
    transport: { target: "pino-pretty" },
  }),
});

const app = express();

// ─── Segurança: headers HTTP ──────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Apps móveis nativas (Android/iOS) não enviam header Origin → permitimos
// pedidos sem Origin. Origens de browser têm de estar em ALLOWED_ORIGINS.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

// ─── Body / Compressão ────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(compression());

// ─── HTTP request logging ─────────────────────────────────────────────────────
app.use(pinoHttp({ logger }));

// ─── Rate limiters ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

const scraperLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

// Endpoint público (sem login) - limitado para evitar abuso / enumeração de tokens
const deviceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

// ─── trust proxy (Render / Railway / etc.) ────────────────────────────────────
app.set("trust proxy", 1);

// ─── Rotas ───────────────────────────────────────────────────────────────────
app.use("/api", limiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/scrape", scraperLimiter, scraperRoutes);
app.use("/api/device", deviceLimiter, deviceRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/lineups", lineupRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/standings", standingRoutes);
app.use("/api/squads", squadRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/match-events", matchEventRoutes);
app.use("/api/app-settings", appSettingsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/helper", helperRoutes);

export default app;
