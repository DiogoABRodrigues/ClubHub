// models/Season.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Season extends Model {
  declare id: number;
  declare year: string;
}

Season.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Season",
    tableName: "seasons",
    timestamps: true,
  },
);

export default Season;
