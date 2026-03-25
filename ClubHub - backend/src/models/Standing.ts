import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Season from "./Season"; // importa o modelo Season
import Competition from "./Competition";

class Standing extends Model {
  public id!: number;
  public teamName!: string;
  public competitionId!: number;
  public seasonId!: number;

  public position!: number;
  public points!: number;
  public played!: number;
  public wins!: number;
  public draws!: number;
  public losses!: number;

  public goalsFor!: number;
  public goalsAgainst!: number;
  public goalDiff!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Standing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    competitionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    seasonId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Season, key: "id" }, // foreign key para seasons
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    played: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    wins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    draws: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    losses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    goalsFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    goalsAgainst: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    goalDiff: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Standing",
    tableName: "standings",
    timestamps: true,
  }
);

// 🔹 Associação opcional para Sequelize
Standing.belongsTo(Season, { foreignKey: "seasonId", as: "season" });
Standing.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });

export default Standing;