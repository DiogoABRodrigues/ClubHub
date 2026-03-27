import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Team extends Model {
  declare name: string;
  declare abbreviation?: string;
  declare logoUrl?: string;
}

Team.init(
  {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    abbreviation: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Team",
    tableName: "teams",
    timestamps: true,
  },
);

export default Team;
