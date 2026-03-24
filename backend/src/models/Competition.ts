import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Competition extends Model {
  declare id: number;
  declare name: string;
  declare season: string;
}

Competition.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    season: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Competition", tableName: "competitions", timestamps: true }
);

export default Competition;
