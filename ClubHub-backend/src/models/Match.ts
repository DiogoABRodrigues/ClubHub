// models/Match.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Match extends Model {
  public id!: number;
  public externalId!: number | null;
  public teamExternalId!: number | null;
  public teamName!: string;
  public date!: Date;
  public time!: string;
  public homeOrAway!: "C" | "F";
  public opponent!: string;
  public opponentExternalId!: number | null;
  public result!: string | null;
  public competitionExternalId!: number | null;
  public competitionId!: number | null;
  public seasonYear!: string | null;
  public seasonId!: number | null;
  public round!: string;
  public outcome!: "V" | "E" | "D" | null;
  public status!: "upcoming" | "live" | "finished";
  public location?: string;
  public statusTime!: "1st" | "interval" | "2nd" | "extra" | "penalties";
  public decidedByPenalties!: boolean;
  public category!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    teamExternalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    homeOrAway: {
      type: DataTypes.ENUM("C", "F"),
      allowNull: false,
    },
    opponent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opponentExternalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    competitionExternalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    result: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    competitionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "competitions",
        key: "id",
      },
    },
    seasonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "seasons",
        key: "id",
      },
    },
    seasonYear: { type: DataTypes.STRING, allowNull: true },
    round: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    outcome: {
      type: DataTypes.ENUM("V", "E", "D"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "live", "finished"),
      allowNull: false,
      defaultValue: "upcoming",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statusTime: {
      type: DataTypes.ENUM("1st", "interval", "2nd", "extra", "penalties"),
      allowNull: true,
    },
    decidedByPenalties: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "over19",
    },
  },
  {
    sequelize,
    modelName: "Match",
    tableName: "matches",
    indexes: [
      {
        fields: ["competitionExternalId"],
      },
      {
        fields: ["competitionId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["seasonYear", "category", "date"],
      },
      {
        name: "matches_season_category_date_idx",
        fields: ["seasonId", "category", "date"],
      },
      {
        name: "matches_date_status_category_idx",
        fields: ["date", "status", "category"],
      },
    ],
  },
);

// Associação
export default Match;
