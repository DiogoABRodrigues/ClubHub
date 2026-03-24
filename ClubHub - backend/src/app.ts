import express from "express";
//import adminRoutes from "./routes/adminRoutes";
//import competitionRoutes from "./routes/competitionRoutes";
//import goalRoutes from "./routes/goalRoutes";
//import lineupRoutes from "./routes/lineupRoutes";
//import matchRoutes from "./routes/matchRoutes";
//import newsRoutes from "./routes/newsRoutes";
//import notificationRoutes from "./routes/notificationRoutes";
//import playerRoutes from "./routes/playerRoutes";
//import roleRoutes from "./routes/roleRoutes";
//import teamRoutes from "./routes/teamRoutes";
//import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API a funcionar");
});

//app.use("/api/teams", teamRoutes);
//app.use("/api/players", playerRoutes);
//app.use("/api/competitions", competitionRoutes);
//app.use("/api/matches", matchRoutes);
//app.use("/api/lineups", lineupRoutes);
//app.use("/api/goals", goalRoutes);
//app.use("/api/roles", roleRoutes);
//app.use("/api/admins", adminRoutes);
//app.use("/api/news", newsRoutes);
//app.use("/api/notifications", notificationRoutes);

//app.use(notFoundHandler);
//app.use(errorHandler);

export default app;
