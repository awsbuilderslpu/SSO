import { NextRequest, NextResponse } from "next/server";

import { requireSSOAdmin } from "@/lib/sso/admin";
import { isSameOriginRequest } from "@/lib/sso/security";
import {
  createSSOClient,
  getAllSSOClients,
  isValidRedirectUri,
  toSSOClientSummary,
} from "@/lib/sso/clients";

export async function GET() {
  const { authorized } = await requireSSOAdmin();

  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const clients = await getAllSSOClients();

    return NextResponse.json(
      { clients },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to load SSO clients:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load clients",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 }
    );
  }

  const { authorized } =
    await requireSSOAdmin();

  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const clientId =
      typeof body.clientId === "string"
        ? body.clientId.trim()
        : "";

    const redirectUris: string[] =
      Array.isArray(body.redirectUris)
        ? body.redirectUris
            .filter(
              (uri: unknown): uri is string =>
                typeof uri === "string"
            )
            .map((uri: string) =>
              uri.trim()
            )
            .filter(Boolean)
        : [];

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Application name is required",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error:
            "Application name must be 100 characters or fewer",
        },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        {
          error:
            "Client ID is required",
        },
        { status: 400 }
      );
    }

    if (clientId.length > 100) {
      return NextResponse.json(
        {
          error:
            "Client ID must be 100 characters or fewer",
        },
        { status: 400 }
      );
    }

    if (
      !/^[a-zA-Z0-9._-]+$/.test(
        clientId
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Client ID can only contain letters, numbers, dots, underscores and hyphens",
        },
        { status: 400 }
      );
    }

    if (
      redirectUris.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one redirect URI is required",
        },
        { status: 400 }
      );
    }

    if (
      redirectUris.length > 20
    ) {
      return NextResponse.json(
        {
          error:
            "A maximum of 20 redirect URIs is allowed",
        },
        { status: 400 }
      );
    }

    const uniqueRedirectUris =
      [...new Set(redirectUris)];

    for (const uri of uniqueRedirectUris) {
      if (!isValidRedirectUri(uri)) {
        return NextResponse.json(
          {
            error:
              `Invalid redirect URI: ${uri}`,
          },
          { status: 400 }
        );
      }
    }

    const client =
      await createSSOClient({
        clientId,
        name,
        redirectUris:
          uniqueRedirectUris,
      });

    return NextResponse.json(
      {
        client: toSSOClientSummary(client),
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Failed to create SSO client:",
      error
    );

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        {
          error:
            "Client ID already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to create client",
      },
      { status: 500 }
    );
  }
}