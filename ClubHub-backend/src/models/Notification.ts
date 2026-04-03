import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Notification extends Model {
  declare id: number;
  declare title: string;
  declare body: string;
  declare type: string;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  },
);

export default Notification;
