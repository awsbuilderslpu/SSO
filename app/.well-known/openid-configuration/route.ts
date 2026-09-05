import { NextResponse } from "next/server";

export async function GET() {
  const issuer =
    process.env.SSO_ISSUER ??
    "http://localhost:3000";

  return NextResponse.json(
    {
      issuer,
      authorization_endpoint:
        `${issuer}/authorize`,
      token_endpoint:
        `${issuer}/oauth/token`,
      jwks_uri:
        `${issuer}/oauth/jwks`,
      userinfo_endpoint:
        `${issuer}/oauth/userinfo`,
      response_types_supported: [
        "code",
      ],
      grant_types_supported: [
        "authorization_code",
      ],
      scopes_supported: [
        "openid",
        "profile",
        "email",
      ],
      subject_types_supported: [
        "public",
      ],
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
      ],
      code_challenge_methods_supported: [
        "S256",
      ],
      id_token_signing_alg_values_supported: [
        "RS256",
      ],
      claims_supported: [
        "sub",
        "name",
        "email",
        "picture",
        "iss",
        "aud",
        "iat",
        "exp",
        "nonce",
      ],
    },
    {
      headers: {
        "Cache-Control":
          "public, max-age=3600",
      },
    }
  );
}