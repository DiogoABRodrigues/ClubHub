import Lineup from "./Lineup";
import Match from "./Match";
import Player from "./Player";
import Stats from "./Stats";
import Squad from "./Squad";
import Season from "./Season";
import MatchEvent from "./MatchEvent";
import Competition from "./Competition";

export const initAssociations = () => {
  Lineup.belongsTo(Match, { foreignKey: "matchId" });
  Lineup.belongsTo(Player, { foreignKey: "playerId" });

  Match.hasMany(Lineup, { foreignKey: "matchId" });
  Player.hasMany(Lineup, { foreignKey: "playerId" });
  Match.hasMany(MatchEvent, { foreignKey: "matchId", as: "events" });
  MatchEvent.belongsTo(Match, { foreignKey: "matchId" });
  Match.belongsTo(Competition, {
    foreignKey: "competitionId",
    as: "competitionDetails",
  });

  Player.hasMany(Stats, {
    foreignKey: "playerExternalId",
    sourceKey: "externalId",
  });
  Stats.belongsTo(Player, {
    foreignKey: "playerExternalId",
    targetKey: "externalId",
  });
  Player.hasMany(Squad, {
    foreignKey: "playerExternalId",
    sourceKey: "externalId",
  });
  Squad.belongsTo(Player, {
    foreignKey: "playerExternalId",
    targetKey: "externalId",
  });
  Stats.belongsTo(Season, {
    foreignKey: "seasonId",
  });
  Season.hasMany(Stats, {
    foreignKey: "seasonId",
  });
  Match.belongsTo(Season, {
    foreignKey: "seasonId",
  });
  Season.hasMany(Match, {
    foreignKey: "seasonId",
  });
};
