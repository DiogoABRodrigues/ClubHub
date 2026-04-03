import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import bcrypt from "bcrypt";

class Admin extends Model {
  declare id: number;
  declare userName: string;
  declare password: string;
  declare role: string;
  declare refreshToken?: string | null;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userName: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["super_admin", "admin"],
    },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "Admin", tableName: "admins", timestamps: true },
);

// Hash password before create
Admin.beforeCreate(async (admin: any) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

// Hash password before update
Admin.beforeUpdate(async (admin: any) => {
  if (admin.changed("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

export default Admin;
