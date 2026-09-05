import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type SSOClient = {
  id: string;
  clientId: string;
  clientSecret: string | null;
  name: string;
  redirectUris: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SSOClientSummary = {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSSOClientInput = {
  clientId?: string;
  name?: string;
  redirectUris?: string[];
  enabled?: boolean;
};

type ClientRow = {
  id: string;
  client_id: string;
  client_secret?: string | null;
  name: string;
  redirect_uris?: unknown;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

function mapClient(row: ClientRow): SSOClient {
  return {
    id: row.id,
    clientId: row.client_id,
    clientSecret:
      row.client_secret ?? null,
    name: row.name,
    redirectUris:
      Array.isArray(row.redirect_uris)
        ? row.redirect_uris
        : [],
    enabled:
      row.enabled === true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapClientSummary(
  row: ClientRow
): SSOClientSummary {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    redirectUris:
      Array.isArray(row.redirect_uris)
        ? row.redirect_uris
        : [],
    enabled:
      row.enabled === true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toSSOClientSummary(
  client: SSOClient
): SSOClientSummary {
  return {
    id: client.id,
    clientId: client.clientId,
    name: client.name,
    redirectUris: client.redirectUris,
    enabled: client.enabled,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

export function generateClientSecret() {
  return `sso_secret_${crypto.randomBytes(32).toString("base64url")}`;
}
export function isValidRedirectUri(value: string) {
  try {
    const uri = new URL(value);
    const isLocalHttp =
      uri.protocol === "http:" &&
      (uri.hostname === "localhost" ||
        uri.hostname === "127.0.0.1" ||
        uri.hostname === "[::1]");

    return (
      (uri.protocol === "https:" || isLocalHttp) &&
      !uri.username &&
      !uri.password &&
      !uri.hash
    );
  } catch {
    return false;
  }
}

export async function getSSOClient(
  clientId: string
): Promise<SSOClient | null> {
  const supabase =
    createAdminClient();

  const { data, error } =
    await supabase
      .from("sso_clients")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const client =
    mapClient(data);

  if (!client.enabled) {
    return null;
  }

  return client;
}

export async function getSSOClientById(
  id: string
): Promise<SSOClient | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sso_clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapClient(data) : null;
}

export async function getAllSSOClients(): Promise<
  SSOClientSummary[]
> {
  const supabase =
    createAdminClient();

  const { data, error } =
    await supabase
      .from("sso_clients")
      .select(
        "id, client_id, name, redirect_uris, enabled, created_at, updated_at"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    mapClientSummary
  );
}

export async function updateSSOClientById(
  id: string,
  input: UpdateSSOClientInput
): Promise<SSOClientSummary | null> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.clientId !== undefined) {
    updates.client_id = input.clientId;
  }

  if (input.name !== undefined) {
    updates.name = input.name;
  }

  if (input.redirectUris !== undefined) {
    updates.redirect_uris = input.redirectUris;
  }

  if (input.enabled !== undefined) {
    updates.enabled = input.enabled;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sso_clients")
    .update(updates)
    .eq("id", id)
    .select(
      "id, client_id, name, redirect_uris, enabled, created_at, updated_at"
    )
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapClientSummary(data) : null;
}

export async function deleteSSOClientById(
  id: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: existing, error: lookupError } =
    await supabase
      .from("sso_clients")
      .select("id")
      .eq("id", id)
      .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (!existing) {
    return false;
  }

  const { error } = await supabase
    .from("sso_clients")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}

export async function createSSOClient({
  clientId,
  name,
  redirectUris,
}: {
  clientId: string;
  name: string;
  redirectUris: string[];
}) {
  const supabase =
    createAdminClient();

  const clientSecret =
    generateClientSecret();

  const { data, error } =
    await supabase
      .from("sso_clients")
      .insert({
        client_id: clientId,
        client_secret:
          clientSecret,
        name,
        redirect_uris:
          redirectUris,
        enabled: true,
      })
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapClient(data);
}