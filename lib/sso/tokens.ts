import { importPKCS8, SignJWT } from "jose";

const accessTokenSecret =
  process.env.SSO_JWT_SECRET;

if (!accessTokenSecret) {
  throw new Error(
    "SSO_JWT_SECRET is not configured"
  );
}

const accessTokenKey =
  new TextEncoder().encode(
    accessTokenSecret
  );

const issuer =
  process.env.SSO_ISSUER ??
  "http://localhost:3000";

const configuredKeyId =
  process.env.SSO_JWT_KEY_ID;

const privateKeyValue =
  process.env.SSO_JWT_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    .trim();

if (
  !configuredKeyId ||
  !privateKeyValue
) {
  throw new Error(
    "SSO_JWT_KEY_ID and SSO_JWT_PRIVATE_KEY are not configured"
  );
}

const keyId: string =
  configuredKeyId;

const configuredPrivateKey: string =
  privateKeyValue;

async function getIdTokenPrivateKey() {
  return importPKCS8(
    configuredPrivateKey,
    "RS256"
  );
}

export async function createAccessToken({
  userId,
  clientId,
  scope,
}: {
  userId: string;
  clientId: string;
  scope: string;
}) {
  return new SignJWT({
    sub: userId,
    client_id: clientId,
    scope,
    token_type: "Bearer",
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuer(issuer)
    .setAudience(clientId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessTokenKey);
}

export async function createIdToken({
  userId,
  clientId,
  nonce,
  name,
  email,
  picture,
}: {
  userId: string;
  clientId: string;
  nonce?: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}) {
  const payload: Record<
    string,
    string
  > = {
    sub: userId,
  };

  if (name) {
    payload.name = name;
  }

  if (email) {
    payload.email = email;
  }

  if (picture) {
    payload.picture = picture;
  }

  if (nonce) {
    payload.nonce = nonce;
  }

  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT",
      kid: keyId,
    })
    .setIssuer(issuer)
    .setAudience(clientId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(
      await getIdTokenPrivateKey()
    );
}