// models/AppSettings.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class AppSettings extends Model {
  declare id: number;
  declare key: string;
  declare value: string;
}

AppSettings.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AppSettings",
    tableName: "app_settings",
    timestamps: true,
  }
);

export default AppSettings;