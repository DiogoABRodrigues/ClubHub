import { Sequelize } from "sequelize-typescript";
import "dotenv/config";

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,      // máximo de ligações
    min: 2,       // mantém algumas abertas
    acquire: 30000, // tempo para tentar obter ligação
    idle: 10000,    // fecha ligação inativa
  },
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            // Valida o certificado SSL do servidor (protege contra MITM)
            rejectUnauthorized: true,
          }
        : false,
  },
});

require("../models/Team");
require("../models/Player");
require("../models/Competition");
require("../models/Match");
require("../models/Lineup");
require("../models/Admin");
require("../models/News");
require("../models/Statement");
