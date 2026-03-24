import app from "./app";
import { sequelize } from "./config/database";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});

sequelize.sync().then(() => {
  console.log("DB ligada");

  app.listen(3000, () => {
    console.log("Servidor a correr 🚀");
  });
});
