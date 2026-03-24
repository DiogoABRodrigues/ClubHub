import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Match from "./Match";
import Player from "./Player";

class Goal extends Model {
  declare id: number;
  declare matchId: number;
  declare playerId: number;
  declare minute: number;
}

Goal.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    matchId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Match, key: "id" } },
    playerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Player, key: "id" } },
    minute: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Goal", tableName: "goals", timestamps: true }
);

Goal.belongsTo(Match, { foreignKey: "matchId" });
Goal.belongsTo(Player, { foreignKey: "playerId" });

export default Goal;
