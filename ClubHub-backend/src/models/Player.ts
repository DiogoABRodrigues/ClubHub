// models/Player.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Player extends Model {
  declare id: number;
  declare externalId: number;
  declare name: string;
  declare photoUrl: string | null;
  declare age: number | null;
  declare category: string;
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
    externalId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    photoUrl: { type: DataTypes.STRING, allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
    category: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "over19" },
  },
  {
    sequelize,
    modelName: "Player",
    tableName: "players",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["externalId", "category"],
      },
    ],
  },
);

export default Player;