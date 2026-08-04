// models/MatchEvent.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class MatchEvent extends Model {
  public id!: number;
  public matchId!: number;
  public matchExternalId!: number | null;
  public type!:
    | "goal"
    | "yellow_card"
    | "red_card"
    | "substitution"
    | "penalty_shootout";
  public minute!: number;
  public phase?: "1st" | "2nd" | "extra" | "penalties" | null;

  public playerId?: number | null;
  public playerInId?: number | null;
  public playerOutId?: number | null;
  public playerExternalId?: number | null;
  public playerInExternalId?: number | null;
  public playerOutExternalId?: number | null;

  public isOpponent!: boolean;
  public isOwnGoal?: boolean;
  public penaltyScored?: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MatchEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "matches",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    matchExternalId: { type: DataTypes.INTEGER, allowNull: true },

    type: {
      type: DataTypes.ENUM(
        "goal",
        "yellow_card",
        "red_card",
        "substitution",
        "penalty_shootout",
      ),
      allowNull: false,
    },

    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    phase: {
      type: DataTypes.ENUM("1st", "2nd", "extra", "penalties"),
      allowNull: true,
    },

    playerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    playerInId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    playerOutId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    playerExternalId: { type: DataTypes.INTEGER, allowNull: true },
    playerInExternalId: { type: DataTypes.INTEGER, allowNull: true },
    playerOutExternalId: { type: DataTypes.INTEGER, allowNull: true },

    isOpponent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOwnGoal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    penaltyScored: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "MatchEvent",
    tableName: "match_events",
    indexes: [
      {
        name: "match_events_match_minute_idx",
        fields: ["matchId", "minute"],
      },
    ],
  },
);

export default MatchEvent;
