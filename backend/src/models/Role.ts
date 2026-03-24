import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Role extends Model {
  declare id: number;
  declare name: 'Seniores' | 'U19' | 'U17' | 'U15' | 'U13' | 'U11' | 'U9' | 'U7'; 
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, modelName: "Role", tableName: "roles", timestamps: true }
);

export default Role;
