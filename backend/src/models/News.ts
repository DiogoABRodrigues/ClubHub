import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Admin from "./Admin";

class News extends Model {
  declare id: number;
  declare title: string;
  declare content: string;
  declare authorId: number;
  declare publishedAt: Date;
}

News.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Admin, key: "id" } },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "News", tableName: "news", timestamps: true }
);

News.belongsTo(Admin, { foreignKey: "authorId" });
Admin.hasMany(News, { foreignKey: "authorId" });

export default News;
