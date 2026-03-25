import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Team from "./Team";

interface StandingAttributes {
  id: number;
  teamName: string;
  competitionId: number;

  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;

  createdAt?: Date;
  updatedAt?: Date;
}

// campos opcionais na criação
interface StandingCreationAttributes
  extends Optional<StandingAttributes, "id"> {}

class Standing
  extends Model<StandingAttributes, StandingCreationAttributes>
  implements StandingAttributes
{
  public id!: number;
  public teamName!: string;
  public competitionId!: number;

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
    tableName: "Standings",
    timestamps: true,
  }
);

export default Standing;