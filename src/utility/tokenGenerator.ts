import crypto from "crypto";

export function generateToken(length: number) {
  return crypto.randomBytes(length).toString("hex");
}
