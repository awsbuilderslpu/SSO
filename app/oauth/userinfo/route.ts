import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSSOClient } from "@/lib/sso/clients";

const secret = process.env.SSO_JWT_SECRET;

if (!secret) {
  throw new Error("SSO_JWT_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret);

export async function GET(
  request: NextRequest
) {
  try {
    const authorization =
      request.headers.get(
        "authorization"
      );

    if (!authorization) {
      return NextResponse.json(
        {
          error:
            "missing_token",
        },
        { status: 401 }
      );
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme?.toLowerCase() !==
        "bearer" ||
      !token
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_token",
        },
        { status: 401 }
      );
    }

    const issuer =
      process.env.SSO_ISSUER ??
      "http://localhost:3000";

    let payload;

    try {
      const result =
        await jwtVerify(
          token,
          secretKey,
          {
            algorithms: ["HS256"],
            issuer,
          }
        );

      payload = result.payload;
    } catch {
      return NextResponse.json(
        {
          error:
            "invalid_token",
          error_description:
            "The access token is invalid or expired",
        },
        { status: 401 }
      );
    }

    const userId =
      typeof payload.sub === "string"
        ? payload.sub
        : "";

    const clientId =
      typeof payload.client_id ===
      "string"
        ? payload.client_id
        : "";

    const audience =
      typeof payload.aud === "string"
        ? payload.aud
        : Array.isArray(
            payload.aud
          )
          ? payload.aud[0]
          : "";

    if (
      !userId ||
      !clientId ||
      !audience ||
      audience !== clientId
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_token",
        },
        { status: 401 }
      );
    }

    const client =
      await getSSOClient(clientId);

    if (!client) {
      return NextResponse.json(
        {
          error:
            "invalid_token",
        },
        { status: 401 }
      );
    }

    const scope =
      typeof payload.scope ===
      "string"
        ? payload.scope
            .split(/\s+/)
            .filter(Boolean)
        : [];

    const supabase =
      createAdminClient();

    const {
      data: profile,
      error,
    } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, avatar_url"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load user profile:",
        error
      );

      return NextResponse.json(
        {
          error:
            "server_error",
        },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "invalid_token",
        },
        { status: 401 }
      );
    }

    const response: Record<
      string,
      unknown
    > = {
      sub: profile.id,
    };

    if (
      scope.includes("profile")
    ) {
      response.name =
        profile.full_name;
      response.picture =
        profile.avatar_url;
    }

    if (
      scope.includes("email")
    ) {
      response.email =
        profile.email;
    }

    return NextResponse.json(
      response,
      {
        headers: {
          "Cache-Control":
            "no-store",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(
      "Userinfo endpoint error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "server_error",
      },
      { status: 500 }
    );
  }
}