import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Device extends Model {
  declare id: string;
  declare pushToken: string;
  declare platform: "android" | "ios";
  declare goals: boolean;
  declare matchday: boolean;
  declare result: boolean;
  declare news: boolean;
  // Escalões subscritos — ex: ["over19", "sub15"]
  // NULL significa "todos" (compatibilidade com dispositivos antigos)
  declare subscribedCategories: string[] | null;
}

Device.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    pushToken: { type: DataTypes.STRING, allowNull: false },
    platform: { type: DataTypes.ENUM("android", "ios"), allowNull: false },
    goals:    { type: DataTypes.BOOLEAN, defaultValue: true },
    matchday: { type: DataTypes.BOOLEAN, defaultValue: true },
    result:   { type: DataTypes.BOOLEAN, defaultValue: true },
    news:     { type: DataTypes.BOOLEAN, defaultValue: true },
    subscribedCategories: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null, // null = subscreve todos (backwards compat)
    },
  },
  {
    sequelize,
    modelName: "Device",
    tableName: "devices",
    timestamps: true,
  },
);

export default Device;