import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variavel de ambiente obrigatoria em falta: ${name}`);
  return value;
}

function secret(name: string): string {
  const value = required(name);
  if (value.length < 32) {
    throw new Error(`${name} tem de ter pelo menos 32 caracteres`);
  }
  return value;
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT invalido");
  }
  return port;
}

function parseOrigins(value: string | undefined): string[] {
  const origins = (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || (isProduction && url.protocol !== "https:")) {
      throw new Error(`Origem CORS invalida: ${origin}`);
    }
  }

  if (isProduction && origins.length === 0) {
    throw new Error("ALLOWED_ORIGINS e obrigatorio em producao");
  }

  return origins;
}

function parseTrustProxy(value: string | undefined): boolean | number | string {
  if (!value) return isProduction ? 1 : false;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: isProduction,
  PORT: parsePort(process.env.PORT),
  DATABASE_URL: required("DATABASE_URL"),
  REDIS_URL: required("REDIS_URL"),
  JWT_ACCESS_SECRET: secret("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: secret("JWT_REFRESH_SECRET"),
  JWT_ISSUER: process.env.JWT_ISSUER?.trim() || "clubhub-api",
  JWT_AUDIENCE: process.env.JWT_AUDIENCE?.trim() || "clubhub-app",
  ALLOWED_ORIGINS: parseOrigins(process.env.ALLOWED_ORIGINS),
  TRUST_PROXY: parseTrustProxy(process.env.TRUST_PROXY),
});

export function isAllowedOrigin(origin: string | undefined): boolean {
  return !origin || env.ALLOWED_ORIGINS.includes(origin);
}
