import Lineup from "./Lineup";
import Match from "./Match";
import Player from "./Player";
import Stats from "./Stats";

export const initAssociations = () => {
  Lineup.belongsTo(Match, { foreignKey: "matchId" });
  Lineup.belongsTo(Player, { foreignKey: "playerId" });

  Match.hasMany(Lineup, { foreignKey: "matchId" });
  Player.hasMany(Lineup, { foreignKey: "playerId" });
};
