import express from "express";
import cors from "cors";
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
import path from "path";
import scraperRoutes from "./routes/scraperRoutes";
import matchEventRoutes from "./routes/matchEvent.routes";
import deviceRoutes from "./routes/device.routes";
import authRoutes from "./routes/auth.routes";
import appSettingsRoutes from "./routes/appSettings.routes";
import notificationsRoutes from "./routes/notification.routes";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests",
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

const scraperLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: "Too many requests",
  },
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/scrape", scraperLimiter, scraperRoutes);
app.use("/api", limiter);
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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/match-events", matchEventRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/app-settings", appSettingsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
