import Lineup from "./Lineup";
import Match from "./Match";
import Player from "./Player";
import Stats from "./Stats";

export const initAssociations = () => {
  Lineup.belongsTo(Match, { foreignKey: "matchId" });
  Lineup.belongsTo(Player, { foreignKey: "playerId" });

  Match.hasMany(Lineup, { foreignKey: "matchId" });
  Player.hasMany(Lineup, { foreignKey: "playerId" });

  Player.hasMany(Stats, {
    foreignKey: "playerExternalId",
    sourceKey: "externalId",
  });
  Stats.belongsTo(Player, {
    foreignKey: "playerExternalId",
    targetKey: "externalId",
  });
};
