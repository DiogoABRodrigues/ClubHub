import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Team from "./Team";
import Competition from "./Competition";

class Match extends Model {
  declare id: number;
  declare date: Date;
  declare homeTeamId: number;
  declare awayTeamId: number;
  declare competitionId: number;
  declare homeScore?: number;
  declare awayScore?: number;
  declare status: "scheduled" | "live" | "finished";
}

Match.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Team, key: "id" } },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Team, key: "id" } },
    competitionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Competition, key: "id" } },
    homeScore: { type: DataTypes.INTEGER },
    awayScore: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM("scheduled", "live", "finished"), allowNull: false, defaultValue: "scheduled" },
  },
  { sequelize, modelName: "Match", tableName: "matches", timestamps: true }
);

// Relações
Match.belongsTo(Team, { as: "homeTeam", foreignKey: "homeTeamId" });
Match.belongsTo(Team, { as: "awayTeam", foreignKey: "awayTeamId" });
Match.belongsTo(Competition, { foreignKey: "competitionId" });

export default Match;
