// models/Match.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Competition from "./Competition";
import Lineup from "./Lineup";

class Match extends Model {
  public id!: number;
  public teamName!: string;
  public date!: Date;
  public time!: string;
  public homeOrAway!: "C" | "F";
  public opponent!: string;
  public result!: string | null;
  public competitionId!: number | null;
  public seasonId!: number | null;
  public round!: string;
  public outcome!: "V" | "E" | "D" | null;
  public status!: "upcoming" | "live" | "finished";
  public events?: any[];
  public location?: string;
  public statusTime!: "1st" | "interval" | "2nd" | "extra" | "penalties";
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
    events: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statusTime: {
      type: DataTypes.ENUM("1st", "interval", "2nd", "extra", "penalties"),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Match",
    tableName: "matches",
    indexes: [
      {
        unique: true,
        fields: ["teamName", "opponent", "homeOrAway", "competitionId"],
      },
      {
        fields: ["competitionId"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

// Associação
Match.belongsTo(Competition, {
  foreignKey: "competitionId",
  as: "competitionDetails",
});

Match.hasMany(Lineup, { foreignKey: "matchId", as: "lineups" });
Lineup.belongsTo(Match, { foreignKey: "matchId" });

export default Match;
