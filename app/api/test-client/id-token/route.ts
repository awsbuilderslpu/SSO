import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const idToken =
      typeof body.idToken === "string"
        ? body.idToken
        : "";

    const nonce =
      typeof body.nonce === "string"
        ? body.nonce
        : "";

    if (!idToken || !nonce) {
      return NextResponse.json(
        {
          error:
            "Missing ID token or nonce",
        },
        { status: 400 }
      );
    }

    const issuer =
      process.env.NEXT_PUBLIC_SSO_ISSUER ??
      "http://localhost:3000";

    const jwks = createRemoteJWKSet(
      new URL(`${issuer}/oauth/jwks`)
    );

    const expectedAudience =
      process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_ID ??
      "NOT_CONFIGURED";

    const result =
      await jwtVerify(
        idToken,
        jwks,
        {
          algorithms: ["RS256"],
          issuer,
          audience: expectedAudience,
          requiredClaims: [
            "iss",
            "sub",
            "aud",
            "iat",
            "exp",
            "nonce",
          ],
        }
      );

    const payload =
      result.payload;

    if (
      payload.nonce !== nonce
    ) {
      return NextResponse.json(
        {
          error:
            "ID token nonce mismatch",
        },
        { status: 401 }
      );
    }

    if (!payload.sub) {
      return NextResponse.json(
        {
          error:
            "ID token subject is missing",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        sub: payload.sub,
        name:
          typeof payload.name ===
          "string"
            ? payload.name
            : undefined,
        email:
          typeof payload.email ===
          "string"
            ? payload.email
            : undefined,
        picture:
          typeof payload.picture ===
          "string"
            ? payload.picture
            : undefined,
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
          Pragma: "no-cache",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid ID token",
      },
      { status: 401 }
    );
  }
}