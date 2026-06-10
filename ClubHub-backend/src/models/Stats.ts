// models/Player.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Stats extends Model {
  declare playerExternalId: number;
  declare seasonId: number;
  declare category: string;

  declare gamesPlayed: number;
  declare goals: number;
  declare minutesPlayed: number;

  declare age: number;
  declare position: string;
}

Stats.init(
  {
    playerExternalId: { type: DataTypes.INTEGER, allowNull: false },
    seasonId: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "over19" },
    gamesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
    goals: { type: DataTypes.INTEGER, defaultValue: 0 },
    minutesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
    age: { type: DataTypes.INTEGER, defaultValue: 0 },
    position: { type: DataTypes.STRING, defaultValue: "Unknown" },
  },
  {
    sequelize,
    modelName: "Stats",
    tableName: "stats",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["playerExternalId", "seasonId", "category"],
      },
    ],
  },
);

export default Stats;