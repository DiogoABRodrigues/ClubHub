import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedHash] = hashedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hashedBuffer = Buffer.from(storedHash, "hex");
  const suppliedBuffer = scryptSync(password, salt, KEY_LENGTH);

  return (
    hashedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(hashedBuffer, suppliedBuffer)
  );
}
