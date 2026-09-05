import { NextRequest, NextResponse } from "next/server";

const clientId =
  process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_ID ??
  "NOT_CONFIGURED";

const clientSecret =
  process.env.SSO_TEST_CLIENT_SECRET ??
  "NOT_CONFIGURED";

export async function POST(
  request: NextRequest
) {
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Test client credentials are not configured",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const code =
      typeof body.code === "string"
        ? body.code
        : "";

    const codeVerifier =
      typeof body.codeVerifier ===
      "string"
        ? body.codeVerifier
        : "";

    if (!code || !codeVerifier) {
      return NextResponse.json(
        {
          error:
            "Missing authorization code or code verifier",
        },
        { status: 400 }
      );
    }

    const credentials =
      Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64");

    const tokenResponse =
      await fetch(
        `${
          process.env.NEXT_PUBLIC_SSO_ISSUER ??
          "http://localhost:3000"
        }/oauth/token`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Basic ${credentials}`,
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            new URLSearchParams({
              grant_type:
                "authorization_code",
              code,
              redirect_uri:
                process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_REDIRECT_URI ?? "https://sso.awslpu.in/test-client/callback",
              code_verifier:
                codeVerifier,
            }).toString(),
        }
      );

    const tokenData =
      await tokenResponse.json();

    return NextResponse.json(
      tokenData,
      {
        status:
          tokenResponse.status,
        headers: {
          "Cache-Control":
            "no-store",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(
      "Test client token exchange failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Token exchange failed",
      },
      { status: 500 }
    );
  }
}