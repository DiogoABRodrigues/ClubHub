import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import http from "http";
import { startMatchReminderJob } from "./jobs/matchReminder.job";
import { wakeUpBackend } from "./jobs/wake-up";
import { warmupBrowser } from "./utils/browser";

const PORT = process.env.PORT;

const server = http.createServer(app);

startMatchReminderJob();
initAssociations();
initSocket(server);
wakeUpBackend();

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    await sequelize.sync({ alter: true });
    console.log("DB ligada");

    server.listen(PORT, async () => {
      console.log(`Servidor a correr em ${PORT}`);
      await warmupBrowser();
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
