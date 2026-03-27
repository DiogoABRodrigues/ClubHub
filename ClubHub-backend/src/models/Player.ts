// models/Player.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Player extends Model {
  declare id: number;
  declare externalId: number;
  declare name: string;
  declare photoUrl: string | null;
  declare age: number | null;
  // Estatísticas da temporada
  declare gamesPlayed: number;
  declare goals: number;
  declare minutesPlayed: number;
  declare seasonId: number | null;
  declare teamId: number | null;
}

Player.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    externalId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    photoUrl: { type: DataTypes.STRING, allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Player",
    tableName: "players",
    timestamps: true,
  },
);

export default Player;
