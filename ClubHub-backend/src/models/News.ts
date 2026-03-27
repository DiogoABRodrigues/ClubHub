import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class News extends Model {
  declare id: number;
  declare title: string;
  declare category: 'Team' | 'Transfers' | 'Events';
  declare excerpt?: string;
  declare content: string;
  declare image?: string;
  declare publishedAt: Date;
}

News.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('Team', 'Transfers', 'Events'), allowNull: false },
    excerpt: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "News", tableName: "news", timestamps: true }
);

export default News;