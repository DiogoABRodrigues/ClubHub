import cron from "node-cron";

// URL do teu backend
const BACKEND_URL = process.env.API_BASE_URL || "http://localhost:3000";

export const wakeUpBackend = () => {
  // Agendar ping a cada 25 minutos
  cron.schedule("*/10 * * * *", () => {
    fetch(`${BACKEND_URL}/auth/wake-up`)
      .then((res) => console.log(`Wake-up ping enviado: ${res.status}`))
      .catch((err) => console.log("Erro ao enviar wake-up ping:", err));
  });

}
