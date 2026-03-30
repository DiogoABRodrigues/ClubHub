import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Device extends Model {
  declare id: string; // deviceId
  declare pushToken: string;
  declare platform: "android" | "ios" | "web";
}

Device.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    pushToken: { type: DataTypes.STRING, allowNull: false },
    platform: {
      type: DataTypes.ENUM("android", "ios", "web"),
      allowNull: false,
    },
  },
  { sequelize, modelName: "Device", tableName: "devices", timestamps: true },
);

export default Device;
