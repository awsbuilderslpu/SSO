import { importPKCS8, SignJWT } from "jose";

const issuer =
  process.env.NEXT_PUBLIC_SSO_ISSUER ?? "http://localhost:3000";

function getAccessTokenKey(): Uint8Array {
  const secret = process.env.SSO_JWT_SECRET;
  if (!secret) {
    throw new Error("SSO_JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

async function getIdTokenPrivateKey() {
  const keyValue = process.env.SSO_JWT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  ).trim();
  if (!keyValue) {
    throw new Error("SSO_JWT_PRIVATE_KEY is not configured");
  }
  return importPKCS8(keyValue, "RS256");
}

function getKeyId(): string {
  const kid = process.env.SSO_JWT_KEY_ID;
  if (!kid) {
    throw new Error("SSO_JWT_KEY_ID is not configured");
  }
  return kid;
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
    .setExpirationTime("30d")
    .sign(getAccessTokenKey());
}

export async function createIdToken({
  userId,
  clientId,
  nonce,
  name,
  email,
  picture,
  role,
}: {
  userId: string;
  clientId: string;
  nonce?: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  role?: string | null;
}) {
  const payload: Record<string, string> = {
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

  if (role) {
    payload.role = role;
  }

  if (nonce) {
    payload.nonce = nonce;
  }

  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT",
      kid: getKeyId(),
    })
    .setIssuer(issuer)
    .setAudience(clientId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(await getIdTokenPrivateKey());
}
