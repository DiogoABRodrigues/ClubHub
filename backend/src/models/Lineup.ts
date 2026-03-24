import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Match from "./Match";
import Player from "./Player";

class Lineup extends Model {
  declare id: number;
  declare matchId: number;
  declare playerId: number;
  declare isStarting: boolean;
}

Lineup.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    matchId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Match, key: "id" } },
    playerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Player, key: "id" } },
    isStarting: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "Lineup", tableName: "lineups", timestamps: true }
);

Lineup.belongsTo(Match, { foreignKey: "matchId" });
Lineup.belongsTo(Player, { foreignKey: "playerId" });

export default Lineup;
