import { Sequelize } from "sequelize-typescript";
import "dotenv/config";
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

// Import models only after the Sequelize instance exists so their `init`
// calls receive a valid connection and can be synced to the database.
require("../models/Team");
require("../models/Player");
require("../models/Competition");
require("../models/Match");
require("../models/Lineup");
require("../models/Admin");
require("../models/News");
require("../models/Statement");
