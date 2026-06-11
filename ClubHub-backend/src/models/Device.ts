import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Device extends Model {
  declare id: string;
  declare pushToken: string;
  declare platform: "android" | "ios";
  // news é global (sem escalão)
  declare news: boolean;
  // over19
  declare over19_goals: boolean;
  declare over19_matchday: boolean;
  declare over19_result: boolean;
  // sub19
  declare sub19_goals: boolean;
  declare sub19_matchday: boolean;
  declare sub19_result: boolean;
  // sub17
  declare sub17_goals: boolean;
  declare sub17_matchday: boolean;
  declare sub17_result: boolean;
  // sub15
  declare sub15_goals: boolean;
  declare sub15_matchday: boolean;
  declare sub15_result: boolean;
  // sub13
  declare sub13_goals: boolean;
  declare sub13_matchday: boolean;
  declare sub13_result: boolean;
}

const boolCol = (defaultValue: boolean) => ({
  type: DataTypes.BOOLEAN,
  defaultValue,
  allowNull: false,
});

Device.init(
  {
    id:        { type: DataTypes.STRING, primaryKey: true },
    pushToken: { type: DataTypes.STRING, allowNull: false },
    platform:  { type: DataTypes.ENUM("android", "ios"), allowNull: false },
    news:            boolCol(true),
    over19_goals:    boolCol(true),
    over19_matchday: boolCol(true),
    over19_result:   boolCol(true),
    sub19_goals:     boolCol(false),
    sub19_matchday:  boolCol(false),
    sub19_result:    boolCol(false),
    sub17_goals:     boolCol(false),
    sub17_matchday:  boolCol(false),
    sub17_result:    boolCol(false),
    sub15_goals:     boolCol(false),
    sub15_matchday:  boolCol(false),
    sub15_result:    boolCol(false),
    sub13_goals:     boolCol(false),
    sub13_matchday:  boolCol(false),
    sub13_result:    boolCol(false),
  },
  {
    sequelize,
    modelName: "Device",
    tableName: "devices",
    timestamps: true,
  },
);

export default Device;