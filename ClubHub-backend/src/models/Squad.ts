// models/Squad.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Season from "./Season";

class Squad extends Model {
  declare playerExternalId: number;
  declare seasonId: number;
  declare number: number | null;
  declare position: string | null;
}

Squad.init(
  {
    playerExternalId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seasonId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Squad",
    tableName: "squad",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["playerExternalId", "seasonId"]
      }
    ]
  }
);

Squad.belongsTo(Season, { foreignKey: "seasonId" });

export default Squad;