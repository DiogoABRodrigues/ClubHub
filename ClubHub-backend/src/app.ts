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
import path from "path";

const app = express();

// 🔹 Configuração CORS
app.use(cors({
  origin: "*", // qualquer
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // se precisares de cookies/autenticação
}));

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API a funcionar");
});

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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;