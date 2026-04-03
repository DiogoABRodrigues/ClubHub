import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import http from "http";
import { startMatchReminderJob } from "./jobs/matchReminder.job";
import { wakeUpBackend } from "./jobs/wake-up";

const server = http.createServer(app);
startMatchReminderJob();
initAssociations();
initSocket(server);
wakeUpBackend();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    await sequelize.sync({ alter: true });

    console.log("DB ligada");

    server.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
