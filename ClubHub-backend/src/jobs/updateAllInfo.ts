import cron from "node-cron";
import { updatePlayersAtomic } from "./updateTeamPlayers";
import { updateMatchesAtomic } from "./updateTeamMatchs";

cron.schedule("0 2 * * 0", async () => {
  // Todos os domingos às 2:00 da manhã
  console.log("🕑 Cron job iniciado: atualização semanal de jogadores");
  try {
    await updatePlayersAtomic();
  } catch (err) {
    console.error("❌ Erro ao atualizar jogadores:", err);
  }
});

cron.schedule("0 2 * * *", async () => {
  // Todos os dias às 2:00 da manhã
  console.log("🕑 Cron job iniciado: atualização diária de jogos");
  try {
    await updateMatchesAtomic();
  } catch (err) {
    console.error("❌ Erro ao atualizar jogos:", err);
  }
});
