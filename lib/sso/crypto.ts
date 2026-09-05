import crypto from "crypto";

export function generateAuthorizationCode() {
  return crypto.randomBytes(32).toString("base64url");
}