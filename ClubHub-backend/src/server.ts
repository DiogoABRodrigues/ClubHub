import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import http from "http";

const server = http.createServer(app);

initAssociations();
initSocket(server);
const PORT = 3000;

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
