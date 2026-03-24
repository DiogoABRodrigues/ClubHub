import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Role from "./Role";

class Admin extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: number;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Role, key: "id" } },
  },
  { sequelize, modelName: "Admin", tableName: "admins", timestamps: true }
);

Admin.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(Admin, { foreignKey: "roleId" });

export default Admin;
