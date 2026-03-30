import app from "./app";
import { sequelize } from "./config/database";
import { initAssociations } from "./models/associations";

initAssociations();


const PORT = 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log("DB ligada");

    app.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
