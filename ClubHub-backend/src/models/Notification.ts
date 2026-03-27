import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Admin from "./Admin";

class Notification extends Model {
  declare id: number;
  declare title: string;
  declare message: string;
  declare automatic: boolean;
  declare hourToSend: Date;
  declare dayToSend: Date;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    automatic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hourToSend: { type: DataTypes.DATE, allowNull: true },
    dayToSend: { type: DataTypes.DATE, allowNull: true },
    recipientRoleId: {
      type: DataTypes.INTEGER,
      references: { model: "roles", key: "id" },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Admin, key: "id" },
    },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  },
);

Notification.belongsTo(Admin, { foreignKey: "authorId" });
Admin.hasMany(Notification, { foreignKey: "authorId" });

export default Notification;
