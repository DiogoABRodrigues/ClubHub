import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Device from "./Device";

class NotificationPreference extends Model {
  declare id: number;
  declare deviceId: string;
  declare events: string[];
  declare news: boolean;
}

NotificationPreference.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: Device, key: "id" },
    },
    events: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    news: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: "NotificationPreference",
    tableName: "notification_preferences",
    timestamps: true,
  },
);

NotificationPreference.belongsTo(Device, { foreignKey: "deviceId" });

export default NotificationPreference;
