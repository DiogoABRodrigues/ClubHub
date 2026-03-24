import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Team from "./Team";

class Player extends Model {
  declare id: number;
  declare name: string;
  declare position: string;
  declare number: number;
  declare teamId: number;
}

Player.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.INTEGER, allowNull: false },
    teamId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Team, key: "id" } },
  },
  { sequelize, modelName: "Player", tableName: "players", timestamps: true }
);

Player.belongsTo(Team, { foreignKey: "teamId" });
Team.hasMany(Player, { foreignKey: "teamId" });

export default Player;
