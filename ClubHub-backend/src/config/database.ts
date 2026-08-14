import { Sequelize } from "sequelize-typescript";
import "dotenv/config";

// CA opcional da base de dados (em Base64). Necessária para fornecedores que
// usam uma CA privada, como o pooler do Supabase, sem perder verify-full.
const sslCaBase64 = process.env.DATABASE_SSL_CA_BASE64?.trim();
const sslCa = sslCaBase64
  ? Buffer.from(sslCaBase64, "base64").toString("utf8")
  : undefined;

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10, // máximo de ligações
    min: 2, // mantém algumas abertas
    acquire: 30000, // tempo para tentar obter ligação
    idle: 10000, // fecha ligação inativa
  },
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            // Mantemos a confirmação da identidade do servidor (verify-full).
            rejectUnauthorized: true,
            ...(sslCa ? { ca: sslCa } : {}),
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
