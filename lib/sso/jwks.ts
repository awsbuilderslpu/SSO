import { exportJWK, importSPKI } from "jose";

const keyId = process.env.SSO_JWT_KEY_ID;
const publicKeyValue = process.env.SSO_JWT_PUBLIC_KEY?.replace(
  /\\n/g,
  "\n"
);

if (!keyId || !publicKeyValue) {
  throw new Error(
    "SSO_JWT_KEY_ID and SSO_JWT_PUBLIC_KEY are not configured"
  );
}

const configuredPublicKey = publicKeyValue;

export async function getPublicJwk() {
  const publicKey = await importSPKI(
    configuredPublicKey,
    "RS256"
  );
  const jwk = await exportJWK(publicKey);

  return {
    kty: jwk.kty,
    use: "sig",
    alg: "RS256",
    kid: keyId,
    n: jwk.n,
    e: jwk.e,
  };
}