import { NextRequest, NextResponse } from "next/server";

import { requireSSOAdmin } from "@/lib/sso/admin";
import {
  deleteSSOClientById,
  getSSOClientById,
  isValidRedirectUri,
  toSSOClientSummary,
  updateSSOClientById,
} from "@/lib/sso/clients";
import { isSameOriginRequest } from "@/lib/sso/security";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin(request?: NextRequest) {
  if (request && !isSameOriginRequest(request)) {
    return false;
  }

  const { authorized } = await requireSSOAdmin();
  return authorized;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const client = await getSSOClientById(id);

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { client: toSSOClientSummary(client) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to load SSO client:", error);

    return NextResponse.json(
      { error: "Failed to load client" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: {
      clientId?: string;
      name?: string;
      redirectUris?: string[];
      enabled?: boolean;
    } = {};

    if (body.clientId !== undefined) {
      if (
        typeof body.clientId !== "string" ||
        !body.clientId.trim() ||
        body.clientId.trim().length > 100 ||
        !/^[a-zA-Z0-9._-]+$/.test(body.clientId.trim())
      ) {
        return NextResponse.json(
          { error: "Invalid client ID" },
          { status: 400 }
        );
      }

      updates.clientId = body.clientId.trim();
    }

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 100
      ) {
        return NextResponse.json(
          { error: "Invalid application name" },
          { status: 400 }
        );
      }

      updates.name = body.name.trim();
    }

    if (body.redirectUris !== undefined) {
      if (
        !Array.isArray(body.redirectUris) ||
        body.redirectUris.length === 0 ||
        body.redirectUris.length > 20 ||
        body.redirectUris.some(
          (uri: unknown) =>
            typeof uri !== "string" ||
            !isValidRedirectUri(uri.trim())
        )
      ) {
        return NextResponse.json(
          { error: "Invalid redirect URIs" },
          { status: 400 }
        );
      }

      const normalizedRedirectUris: string[] =
        body.redirectUris.map(
          (uri: unknown) => (uri as string).trim()
        );

      updates.redirectUris = [
        ...new Set(normalizedRedirectUris),
      ];
    }

    if (body.enabled !== undefined) {
      if (typeof body.enabled !== "boolean") {
        return NextResponse.json(
          { error: "Invalid enabled status" },
          { status: 400 }
        );
      }

      updates.enabled = body.enabled;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const client = await updateSSOClientById(id, updates);

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { client },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("Failed to update SSO client:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { error: "Client ID already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteSSOClientById(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete SSO client:", error);

    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
