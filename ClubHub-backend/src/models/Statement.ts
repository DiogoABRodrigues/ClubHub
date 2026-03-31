import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Admin from "./Admin";

class Statement extends Model {
  declare id: number;
  declare title: string;
  declare message: string;
  declare dateToExpire: Date;
}

Statement.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    automatic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dateToExpire: { type: DataTypes.DATE, allowNull: true },
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
    modelName: "Statement",
    tableName: "statements",
    timestamps: true,
  },
);

Statement.belongsTo(Admin, { foreignKey: "authorId" });
Admin.hasMany(Statement, { foreignKey: "authorId" });

export default Statement;
