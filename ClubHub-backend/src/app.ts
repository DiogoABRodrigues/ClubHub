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
import AuthController from "./controllers/auth.controller";
import appSettingsRoutes from "./routes/appSettings.routes";
import notificationsRoutes from "./routes/notification.routes";
import feedbackRoutes from "./routes/feedback.routes";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helperRoutes from "./routes/helper.routes";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";
import { env, isAllowedOrigin } from "./config/env";
import { requestSecurity } from "./middlewares/requestSecurity";
import { randomUUID } from "crypto";

// ─── Logger ───────────────────────────────────────────────────────────────────
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.refreshToken",
      "res.headers.set-cookie",
    ],
    censor: "[REDACTED]",
  },
  ...(env.NODE_ENV !== "production" && {
    transport: { target: "pino-pretty" },
  }),
});

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY);

// ─── Segurança: headers HTTP ──────────────────────────────────────────────────
app.use(
  helmet({
    referrerPolicy: { policy: "no-referrer" },
    strictTransportSecurity: env.IS_PRODUCTION
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Apps móveis nativas (Android/iOS) não enviam header Origin → permitimos
// pedidos sem Origin. Origens de browser têm de estar em ALLOWED_ORIGINS.
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem CORS nao permitida"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Request-Id",
      "X-Device-Token",
    ],
    credentials: false,
    maxAge: 600,
  }),
);

// ─── Body / Compressão ────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(requestSecurity);
app.use(compression());

// ─── HTTP request logging ─────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const supplied = req.headers["x-request-id"];
      const id =
        typeof supplied === "string" && /^[a-zA-Z0-9._-]{1,100}$/.test(supplied)
          ? supplied
          : randomUUID();
      res.setHeader("X-Request-Id", id);
      return id;
    },
  }),
);

// Endpoint leve para health checks da pipeline e da infraestrutura.
app.get("/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ok" });
});

// Landing endpoint para scanners e verificações básicas do serviço.
app.get("/", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ name: "ClubHub API", status: "ok" });
});

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

// Endpoint dedicado para evitar cold starts (cron interno) — fora do authLimiter
const wakeUpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

// ─── trust proxy (Render / Railway / etc.) ────────────────────────────────────
// ─── Rotas ───────────────────────────────────────────────────────────────────
// Rota dedicada para o cron de wake-up — fora do authLimiter (10 req/min),
// que poderia conflituar com pings frequentes (4x/hora).
app.get("/api/wake-up", wakeUpLimiter, (req, res, next) =>
  AuthController.wakeUp(req, res, next),
);

app.use("/api", limiter);
app.use(
  "/api/auth",
  authLimiter,
  (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    next();
  },
  authRoutes,
);
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

// ─── 404 + tratamento de erros ───────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
