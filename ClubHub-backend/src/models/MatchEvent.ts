// models/MatchEvent.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class MatchEvent extends Model {
  public id!: number;
  public matchId!: number;
  public type!: "goal" | "yellow_card" | "red_card" | "substitution";
  public minute!: number;

  public playerId?: number | null;
  public playerInId?: number | null;
  public playerOutId?: number | null;

  public isOpponent!: boolean;
  public isOwnGoal?: boolean;

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

    type: {
      type: DataTypes.ENUM(
        "goal",
        "yellow_card",
        "red_card",
        "substitution",
      ),
      allowNull: false,
    },

    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

    isOpponent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOwnGoal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "MatchEvent",
    tableName: "match_events",
  },
);

export default MatchEvent;