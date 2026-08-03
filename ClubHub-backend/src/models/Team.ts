import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Team extends Model {
  declare id: number;
  declare externalId: number | null;
  declare name: string;
  declare abbreviation?: string;
  declare logoUrl?: string;
}

Team.init(
  {
    // O nome não identifica uma equipa de forma fiável: o mesmo clube pode ter
    // uma equipa por escalão. O ID do ZeroZero é a identidade estável.
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
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
  },
);

export default Team;
