import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Team from "./Team";

class Player extends Model {
  declare name: string;
  declare position: string;
  declare number: number;
  declare age: number;
  declare photoUrl: string;
}

Player.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: true },
    number: { type: DataTypes.INTEGER, allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
    photoUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "Player", tableName: "players", timestamps: true }
);

export default Player;