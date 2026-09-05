import crypto from "crypto";

export function verifyPKCE(
  codeVerifier: string,
  codeChallenge: string
) {
  const hash = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest();

  const calculatedChallenge = hash.toString("base64url");

  return calculatedChallenge === codeChallenge;
}