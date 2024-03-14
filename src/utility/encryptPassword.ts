import { createHash, randomBytes } from "crypto";

export const generateSalt = (length: number = 16): string => {
  return randomBytes(length).toString("hex");
};
export const hashPassword = (password: string, salt: string): string => {
  const hash = createHash("sha256");
  hash.update(password + salt);
  return hash.digest("hex");
};
export const comparePasswords = (
  enteredPassword: string,
  storedHashedPassword: string,
  storedSalt: string
): boolean => {
  const hashedEnteredPassword = hashPassword(enteredPassword, storedSalt);
  return hashedEnteredPassword === storedHashedPassword;
};
