import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Competition extends Model {
  declare id: number;
  declare name: string;
  declare seasonId: number;
}

Competition.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    seasonId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Competition", tableName: "competitions", timestamps: true }
);

export default Competition;