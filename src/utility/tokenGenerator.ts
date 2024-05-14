import crypto from "crypto";

export function generateToken(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

export function createResetPasswordToken(){
  const resetToken=crypto.randomBytes(32).toString('hex');
  crypto.createHash('sha256').update(resetToken).digest('hex')
}
