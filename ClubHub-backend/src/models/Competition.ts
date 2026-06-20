import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export type LegendItem = {
  color: string; // hex, ex: "#47d406"
  label: string; // ex: "Promoção à 1ª Divisão"
};

class Competition extends Model {
  declare id: number;
  declare name: string;
  declare seasonId: number;
  declare category: string;
  declare legend: LegendItem[] | null;
  declare externalId: number | null;
}

Competition.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seasonId: { type: DataTypes.INTEGER, allowNull: false },
    category: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "over19",
    },
    legend: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Competition",
    tableName: "competitions",
    timestamps: true,
    indexes: [
      {
        name: "competitions_season_category_idx",
        fields: ["seasonId", "category"],
      },
      {
        name: "competitions_external_id_idx",
        fields: ["externalId"],
      },
    ],
  },
);

export default Competition;
