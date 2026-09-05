import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSSOClient } from "@/lib/sso/clients";
import { consumeAuthorizationCode } from "@/lib/sso/authorization-codes";
import { verifyPKCE } from "@/lib/sso/pkce";
import {
  createAccessToken,
  createIdToken,
} from "@/lib/sso/tokens";
import { createAdminClient } from "@/lib/supabase/admin";

function parseBasicAuth(
  request: NextRequest
) {
  const header =
    request.headers.get(
      "authorization"
    );

  if (!header) {
    return null;
  }

  const [scheme, encoded] =
    header.split(" ");

  if (
    scheme?.toLowerCase() !==
      "basic" ||
    !encoded
  ) {
    return null;
  }

  try {
    const decoded =
      Buffer.from(
        encoded,
        "base64"
      ).toString("utf8");

    const separator =
      decoded.indexOf(":");

    if (separator === -1) {
      return null;
    }

    return {
      clientId: decoded.slice(
        0,
        separator
      ),
      clientSecret:
        decoded.slice(
          separator + 1
        ),
    };
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const contentType =
      request.headers.get(
        "content-type"
      ) ?? "";

    let body: Record<
      string,
      unknown
    > = {};

    if (
      contentType.includes(
        "application/x-www-form-urlencoded"
      )
    ) {
      const formData =
        await request.formData();

      body = Object.fromEntries(
        formData.entries()
      );
    } else if (
      contentType.includes(
        "application/json"
      )
    ) {
      body = await request.json();
    }

    const basicAuth =
      parseBasicAuth(request);

    const clientId =
      basicAuth?.clientId ??
      "";

    const clientSecret =
      basicAuth?.clientSecret ??
      "";

    const grantType =
      typeof body.grant_type ===
      "string"
        ? body.grant_type
        : "";

    const code =
      typeof body.code ===
      "string"
        ? body.code
        : "";

    const redirectUri =
      typeof body.redirect_uri ===
      "string"
        ? body.redirect_uri
        : "";

    const codeVerifier =
      typeof body.code_verifier ===
      "string"
        ? body.code_verifier
        : "";

    if (
      grantType !==
      "authorization_code"
    ) {
      return NextResponse.json(
        {
          error:
            "unsupported_grant_type",
        },
        { status: 400 }
      );
    }

    if (
      !clientId ||
      !clientSecret
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_client",
          error_description:
            "Client authentication is required",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate":
              'Basic realm="OAuth Token Endpoint"',
          },
        }
      );
    }

    if (
      !code ||
      !redirectUri ||
      !codeVerifier
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_request",
          error_description:
            "Missing required parameters",
        },
        { status: 400 }
      );
    }

    const client =
      await getSSOClient(clientId);

    if (!client) {
      return NextResponse.json(
        {
          error:
            "invalid_client",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate":
              'Basic realm="OAuth Token Endpoint"',
          },
        }
      );
    }

    if (!client.clientSecret) {
      return NextResponse.json(
        {
          error:
            "invalid_client",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate":
              'Basic realm="OAuth Token Endpoint"',
          },
        }
      );
    }

    const suppliedSecret = Buffer.from(
      clientSecret
    );
    const storedSecret = Buffer.from(
      client.clientSecret
    );

    if (
      suppliedSecret.length !== storedSecret.length ||
      !crypto.timingSafeEqual(
        suppliedSecret,
        storedSecret
      )
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_client",
          error_description:
            "Invalid client credentials",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate":
              'Basic realm="OAuth Token Endpoint"',
          },
        }
      );
    }

    if (
      !client.redirectUris.includes(
        redirectUri
      )
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "Invalid redirect_uri",
        },
        { status: 400 }
      );
    }

    const authorizationCode =
      await consumeAuthorizationCode(
        code
      );

    if (!authorizationCode) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "Invalid or expired authorization code",
        },
        { status: 400 }
      );
    }

    if (
      authorizationCode.clientId !==
      clientId
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "Authorization code was not issued to this client",
        },
        { status: 400 }
      );
    }

    if (
      authorizationCode.redirectUri !==
      redirectUri
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "Redirect URI mismatch",
        },
        { status: 400 }
      );
    }

    if (
      !authorizationCode.scope
    ) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "Authorization scope is missing",
        },
        { status: 400 }
      );
    }

    const validPKCE =
      verifyPKCE(
        codeVerifier,
        authorizationCode.codeChallenge
      );

    if (!validPKCE) {
      return NextResponse.json(
        {
          error:
            "invalid_grant",
          error_description:
            "PKCE verification failed",
        },
        { status: 400 }
      );
    }

    const accessToken =
      await createAccessToken({
        userId:
          authorizationCode.userId,
        clientId,
        scope:
          authorizationCode.scope,
      });

    const response: Record<
      string,
      unknown
    > = {
      access_token:
        accessToken,
      token_type:
        "Bearer",
      expires_in:
        900,
      scope:
        authorizationCode.scope,
    };

    if (
      authorizationCode.scope
        .split(/\s+/)
        .includes("openid")
    ) {
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
        .eq(
          "id",
          authorizationCode.userId
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Failed to load profile for ID token:",
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
              "invalid_grant",
            error_description:
              "User account could not be found",
          },
          { status: 400 }
        );
      }

      const scopes =
        authorizationCode.scope.split(
          /\s+/
        );

      const idToken =
        await createIdToken({
          userId:
            authorizationCode.userId,
          clientId,
          nonce:
            authorizationCode.nonce ??
            undefined,
          name: scopes.includes(
            "profile"
          )
            ? profile.full_name
            : null,
          email: scopes.includes(
            "email"
          )
            ? profile.email
            : null,
          picture: scopes.includes(
            "profile"
          )
            ? profile.avatar_url
            : null,
        });

      response.id_token =
        idToken;
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
      "Token endpoint error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "invalid_request",
      },
      { status: 400 }
    );
  }
}