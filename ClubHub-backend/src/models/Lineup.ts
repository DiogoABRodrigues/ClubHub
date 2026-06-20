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
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Match, key: "id" },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Player, key: "id" },
    },
    isStarting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Lineup",
    tableName: "lineups",
    timestamps: true,
    indexes: [
      {
        name: "lineups_match_idx",
        fields: ["matchId"],
      },
      {
        name: "lineups_match_player_unique",
        unique: true,
        fields: ["matchId", "playerId"],
      },
    ],
  },
);

export default Lineup;
