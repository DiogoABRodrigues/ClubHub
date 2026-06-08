import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export type LegendItem = {
  color: string;  // hex, ex: "#47d406"
  label: string;  // ex: "Promoção à 1ª Divisão"
};

class Competition extends Model {
  declare id: number;
  declare name: string;
  declare seasonId: number;
  declare legend: LegendItem[] | null;
}

Competition.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seasonId: { type: DataTypes.INTEGER, allowNull: false },
    legend: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Competition",
    tableName: "competitions",
    timestamps: true,
  },
);

export default Competition;