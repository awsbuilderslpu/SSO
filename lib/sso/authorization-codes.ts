import { createAdminClient } from "@/lib/supabase/admin";

type AuthorizationCode = {
  code: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  nonce: string | null;
  expiresAt: number;
};

type AuthorizationCodeRow = {
  code: string;
  client_id: string;
  user_id: string;
  redirect_uri: string;
  code_challenge: string;
  scope: string;
  nonce?: string | null;
  expires_at: string;
};

function mapAuthorizationCode(
  row: AuthorizationCodeRow
): AuthorizationCode {
  return {
    code: row.code,
    clientId: row.client_id,
    userId: row.user_id,
    redirectUri: row.redirect_uri,
    codeChallenge: row.code_challenge,
    scope: row.scope,
    nonce: row.nonce ?? null,
    expiresAt: new Date(
      row.expires_at
    ).getTime(),
  };
}

export async function saveAuthorizationCode(
  data: AuthorizationCode
) {
  const supabase =
    createAdminClient();

  const { error } =
    await supabase
      .from("sso_authorization_codes")
      .insert({
        code: data.code,
        client_id: data.clientId,
        user_id: data.userId,
        redirect_uri: data.redirectUri,
        code_challenge:
          data.codeChallenge,
        scope: data.scope,
        nonce: data.nonce,
        expires_at: new Date(
          data.expiresAt
        ).toISOString(),
      });

  if (error) {
    throw error;
  }
}

export async function consumeAuthorizationCode(
  code: string
): Promise<AuthorizationCode | null> {
  const supabase =
    createAdminClient();

  const { data, error } =
    await supabase
      .from("sso_authorization_codes")
      .delete()
      .eq("code", code)
      .gt(
        "expires_at",
        new Date().toISOString()
      )
      .select("*")
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapAuthorizationCode(data);
}