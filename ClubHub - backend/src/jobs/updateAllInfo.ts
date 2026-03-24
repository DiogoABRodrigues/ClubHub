import cron from "node-cron";
import { updatePlayersAtomic } from "./updateTeamPlayers";

cron.schedule("0 2 * * 0", async () => { 
  // Todos os domingos às 2:00 da manhã
  console.log("🕑 Cron job iniciado: atualização semanal de jogadores");
  try {
    await updatePlayersAtomic();
  } catch (err) {
    console.error("❌ Erro ao atualizar jogadores:", err);
  }
});