"use client";

import { useState } from "react";

const clientId =
  process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_ID ?? "NOT_CONFIGURED";

const redirectUri =
  process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_REDIRECT_URI ??
  "http://localhost:3000/test-client/callback";

function base64url(
  buffer: ArrayBuffer
) {
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(buffer)
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generatePKCE() {
  const array =
    new Uint8Array(32);

  window.crypto.getRandomValues(
    array
  );

  const codeVerifier =
    base64url(array.buffer);

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      codeVerifier
    );

  const digest =
    await window.crypto.subtle.digest(
      "SHA-256",
      data
    );

  const codeChallenge =
    base64url(digest);

  return {
    codeVerifier,
    codeChallenge,
  };
}

export default function TestClient() {
  const [loading, setLoading] =
    useState(false);

  async function login() {
    setLoading(true);

    try {
      const {
        codeVerifier,
        codeChallenge,
      } =
        await generatePKCE();

      const state =
        window.crypto.randomUUID();

      const nonce =
        window.crypto.randomUUID();

      sessionStorage.setItem(
        "sso_code_verifier",
        codeVerifier
      );

      sessionStorage.setItem(
        "sso_state",
        state
      );

      sessionStorage.setItem(
        "sso_nonce",
        nonce
      );

      const params =
        new URLSearchParams({
          client_id: clientId,
          redirect_uri:
            redirectUri,
          response_type:
            "code",
          scope:
            "openid profile email",
          state,
          nonce,
          code_challenge:
            codeChallenge,
          code_challenge_method:
            "S256",
        });

      window.location.href =
        `/authorize?${params.toString()}`;
    } catch (error) {
      console.error(
        "SSO login error:",
        error
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-280px] h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[150px]" />

        <div className="absolute bottom-[-250px] right-[-200px] h-[550px] w-[550px] rounded-full bg-orange-400/[0.035] blur-[150px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-auto object-contain"
            />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                AWS LPU
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                Identity Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
              OAuth 2.0 + OIDC
            </span>
          </div>
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-7 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-orange-400">
              Protected application
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              AWS LPU Mock Exams
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
              Sign in using your AWS LPU identity
              through the OAuth authorization flow.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0d0d0d] shadow-2xl shadow-black/40">
            <div className="border-b border-white/[0.07] p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                  <img
                    src="/aws_sbg.png"
                    alt="AWS LPU"
                    className="h-9 w-auto object-contain"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                    OAuth client
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    SSO
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    AWS LPU Identity Services
                  </p>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-8">
              <div className="space-y-3">
                <InfoRow
                  label="Identity"
                  value="AWS LPU account"
                />

                <InfoRow
                  label="Protocol"
                  value="OAuth 2.0 + OIDC"
                />

                <InfoRow
                  label="Protection"
                  value="PKCE · State · Nonce"
                />

                <InfoRow
                  label="Access"
                  value="OpenID · Profile · Email"
                />
              </div>

              <button
                type="button"
                onClick={login}
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Redirecting...
                  </>
                ) : (
                  "Continue with AWS LPU"
                )}
              </button>

              <p className="mt-6 text-center text-[11px] leading-5 text-zinc-700">
                Authentication is handled by AWS LPU
                Identity Services. This application
                never receives your password.
              </p>
            </div>
          </div>

          <p className="mt-7 text-center text-[10px] uppercase tracking-[0.16em] text-zinc-700">
            AWS LPU Mock Exams
          </p>
        </div>
      </section>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
      <span className="text-xs text-zinc-600">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-zinc-300">
        {value}
      </span>
    </div>
  );
}