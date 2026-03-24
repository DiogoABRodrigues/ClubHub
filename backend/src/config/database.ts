import { Sequelize } from "sequelize-typescript";
import "dotenv/config";
import Team from "../models/Team";
import Player from "../models/Player";
import Competition from "../models/Competition";
import Match from "../models/Match";
import Lineup from "../models/Lineup";
import Goal from "../models/Goal";
import Role from "../models/Role";
import Admin from "../models/Admin";
import News from "../models/News";
import Notification from "../models/Notification";

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
