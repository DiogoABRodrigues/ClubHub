import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Feedback extends Model {
  declare id: number;
  declare type: "suggestion" | "bug";
  declare message: string;
  declare imageUrl: string | null;
  declare deviceId: string | null;
  declare createdAt: Date;
}

Feedback.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM("suggestion", "bug"), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    deviceId: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Feedback",
    tableName: "feedbacks",
    timestamps: true,
    indexes: [
      {
        name: "feedback_created_at_idx",
        fields: ["createdAt"],
      },
    ],
  },
);

export default Feedback;
