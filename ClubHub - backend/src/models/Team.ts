import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Team extends Model {
  declare id: number;
  declare name: string;
  declare abbreviation?: string;
  declare logoUrl?: string;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    abbreviation: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Team",
    tableName: "teams",
    timestamps: true,
  }
);

export default Team;