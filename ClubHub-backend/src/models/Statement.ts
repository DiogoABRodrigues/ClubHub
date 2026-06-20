import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

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
    dateToExpire: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Statement",
    tableName: "statements",
    timestamps: true,
  },
);

export default Statement;
