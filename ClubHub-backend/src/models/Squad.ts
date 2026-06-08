// models/Squad.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Season from "./Season";

// Três estados possíveis para um jogador dentro de um squad/época:
//  - "active"  → está no plantel, aparece normalmente
//  - "left"    → saiu durante a época, aparece a cinzento
//  - "error"   → entrou por erro da API, não aparece de todo
export type SquadStatus = "active" | "left" | "error";

class Squad extends Model {
  declare playerExternalId: number;
  declare seasonId: number;
  declare number: number | null;
  declare position: string | null;
  declare status: SquadStatus;
}

Squad.init(
  {
    playerExternalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seasonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "left", "error"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Squad",
    tableName: "squad",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["playerExternalId", "seasonId"],
      },
    ],
  },
);

Squad.belongsTo(Season, { foreignKey: "seasonId" });

export default Squad;
