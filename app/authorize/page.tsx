import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSSOClient } from "@/lib/sso/clients";
import { saveAuthorizationCode } from "@/lib/sso/authorization-codes";
import { generateAuthorizationCode } from "@/lib/sso/crypto";

type SearchParams = {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
  nonce?: string;
  code_challenge?: string;
  code_challenge_method?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const allowedScopes = new Set([
  "openid",
  "profile",
  "email",
]);

export default async function AuthorizePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const clientId =
    params.client_id ?? "";

  const redirectUri =
    params.redirect_uri ?? "";

  const responseType =
    params.response_type ?? "";

  const scope =
    params.scope ?? "";

  const state =
    params.state ?? "";

  const nonce =
    params.nonce ?? "";

  const codeChallenge =
    params.code_challenge ?? "";

  const codeChallengeMethod =
    params.code_challenge_method ?? "";

  if (!clientId) {
    return (
      <ErrorPage message="Missing client_id." />
    );
  }

  if (!redirectUri) {
    return (
      <ErrorPage message="Missing redirect_uri." />
    );
  }

  if (responseType !== "code") {
    return (
      <ErrorPage message="Only response_type=code is supported." />
    );
  }

  if (!codeChallenge) {
    return (
      <ErrorPage message="PKCE is required." />
    );
  }

  if (
    codeChallengeMethod !==
    "S256"
  ) {
    return (
      <ErrorPage message="Only S256 PKCE is supported." />
    );
  }

  if (!nonce) {
    return (
      <ErrorPage message="OIDC nonce is required." />
    );
  }

  let client;

  try {
    client =
      await getSSOClient(clientId);
  } catch (error) {
    console.error(
      "Failed to load OAuth client:",
      error
    );

    return (
      <ErrorPage message="Unable to load application." />
    );
  }

  if (!client) {
    return (
      <ErrorPage message="Unknown or disabled application." />
    );
  }

  if (
    !client.redirectUris.includes(
      redirectUri
    )
  ) {
    return (
      <ErrorPage message="Invalid redirect_uri." />
    );
  }

  const requestedScopes =
    scope
      .split(/\s+/)
      .filter(Boolean);

  if (
    requestedScopes.length === 0
  ) {
    return (
      <ErrorPage message="A scope is required." />
    );
  }

  if (
    requestedScopes.some(
      (requestedScope) =>
        !allowedScopes.has(
          requestedScope
        )
    )
  ) {
    return (
      <ErrorPage message="One or more requested scopes are not supported." />
    );
  }

  if (
    !requestedScopes.includes(
      "openid"
    )
  ) {
    return (
      <ErrorPage message="The openid scope is required." />
    );
  }

  const normalizedScope =
    Array.from(
      new Set(requestedScopes)
    ).join(" ");

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    const authorizeParams =
      new URLSearchParams();

    authorizeParams.set(
      "client_id",
      clientId
    );

    authorizeParams.set(
      "redirect_uri",
      redirectUri
    );

    authorizeParams.set(
      "response_type",
      responseType
    );

    authorizeParams.set(
      "scope",
      normalizedScope
    );

    authorizeParams.set(
      "nonce",
      nonce
    );

    authorizeParams.set(
      "code_challenge",
      codeChallenge
    );

    authorizeParams.set(
      "code_challenge_method",
      codeChallengeMethod
    );

    if (state) {
      authorizeParams.set(
        "state",
        state
      );
    }

    redirect(
      `/login?returnTo=${encodeURIComponent(
        `/authorize?${authorizeParams.toString()}`
      )}`
    );
  }

  const code =
    generateAuthorizationCode();

  await saveAuthorizationCode({
    code,
    clientId,
    userId: user.id,
    redirectUri,
    codeChallenge,
    scope: normalizedScope,
    nonce,
    expiresAt:
      Date.now() + 60_000,
  });

  const callbackUrl =
    new URL(redirectUri);

  callbackUrl.searchParams.set(
    "code",
    code
  );

  if (state) {
    callbackUrl.searchParams.set(
      "state",
      state
    );
  }

  redirect(
    callbackUrl.toString()
  );
}

function ErrorPage({
  message,
}: {
  message: string;
}) {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <img
            src="/aws_sbg.png"
            alt="AWS LPU"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0d0d0d] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.05]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-red-400"
            >
              <path
                d="M12 8v5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="16.5"
                r="1"
                fill="currentColor"
              />

              <path
                d="m10.3 4.7-6.7 11.7a2 2 0 0 0 3.4 0l6.7-11.7a2 2 0 0 0-3.4 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-red-400">
            Authorization error
          </p>

          <h1 className="mt-3 text-2xl font-semibold">
            Unable to continue
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {message}
          </p>

          <a
            href="/"
            className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Return home
          </a>
        </div>
      </section>
    </main>
  );
}