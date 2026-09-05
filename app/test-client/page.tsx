"use client";

import { useState } from "react";

const clientId =
  process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_ID ??
  "NOT_CONFIGURED";

const redirectUri =
  process.env.NEXT_PUBLIC_SSO_TEST_CLIENT_REDIRECT_URI ??
  "http://localhost:3000/test-client/callback";

function base64url(buffer: ArrayBuffer) {
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
  const array = new Uint8Array(32);

  window.crypto.getRandomValues(array);

  const codeVerifier =
    base64url(array.buffer);

  const encoder = new TextEncoder();

  const data = encoder.encode(
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
      } = await generatePKCE();

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
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid profile email",
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
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/[0.08] bg-[#0c0c0c]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-auto object-contain"
            />

            <div className="h-7 w-px bg-white/[0.12]" />

            <div>
              <p className="text-sm font-semibold tracking-wide">
                AWS LPU
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Identity Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border border-white/[0.08] bg-[#101010] px-3 py-2">
            <span className="h-1.5 w-1.5 bg-emerald-400" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              OAuth 2.0 + OIDC
            </span>
          </div>
        </div>
      </header>

      <div className="border-b border-white/[0.07] bg-[#0a0a0a]">
        <div className="mx-auto flex h-10 max-w-[1440px] items-center px-6 lg:px-10">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Protected Application
          </span>

          <span className="mx-3 text-zinc-800">
            /
          </span>

          <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">
            Test SSO Client
          </span>
        </div>
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-113px)] max-w-[1440px] items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-3">
              <div className="h-10 w-1 bg-orange-400" />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                  Protected Application
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-700">
                  Application authentication
                </p>
              </div>
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Test SSO Client
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-500">
              Sign in with your AWS LPU identity to
              access protected application services.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]">
              <InfoCell
                label="Identity"
                value="AWS LPU Account"
              />

              <InfoCell
                label="Protocol"
                value="OAuth 2.0 + OIDC"
              />

              <InfoCell
                label="Protection"
                value="PKCE + State + Nonce"
              />

              <InfoCell
                label="Access"
                value="OpenID + Profile + Email"
              />
            </div>
          </div>

          <div className="border border-white/[0.10] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] bg-[#101010] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Sign In
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    AWS LPU Identity
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center border border-white/[0.08] bg-[#151515]">
                  <img
                    src="/aws_sbg.png"
                    alt="AWS LPU"
                    className="h-6 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="border border-white/[0.07] bg-[#101010]">
                <div className="border-b border-white/[0.07] px-4 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Authentication Provider
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                      Application
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-300">
                      Test SSO Client
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                      Identity Provider
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-300">
                      AWS LPU Identity Services
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={login}
                disabled={loading}
                className="mt-5 flex h-12 w-full items-center justify-center border border-white bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:border-orange-400 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-3.5 w-3.5 animate-spin border-2 border-black/20 border-t-black" />
                    Redirecting
                  </span>
                ) : (
                  "Continue with AWS LPU"
                )}
              </button>

              <div className="mt-5 flex items-start gap-3 border-t border-white/[0.07] pt-5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-emerald-400" />

                <p className="text-[10px] leading-5 text-zinc-600">
                  Authentication is handled by AWS LPU
                  Identity Services. Your password is
                  never shared with this application.
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.08] bg-[#0a0a0a] px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-700">
                  Identity Services
                </span>

                <span className="font-mono text-[8px] text-zinc-800">
                  sso.awslpu.in
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0d0d0d] px-4 py-4">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
        {label}
      </p>

      <p className="mt-2 text-[11px] font-medium text-zinc-300">
        {value}
      </p>
    </div>
  );
}