"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewClientPage() {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [redirectUris, setRedirectUris] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdClient, setCreatedClient] = useState(false);

  async function createClient() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/clients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            clientId: clientId.trim(),
            redirectUris: redirectUris
              .split("\n")
              .map((uri) => uri.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create client"
        );
      }

      setCreatedClient(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (createdClient) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <header className="border-b border-white/[0.08] bg-[#0c0c0c]">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-6 lg:px-10">
            <Link
              href="/admin"
              className="flex items-center gap-4"
            >
              <img
                src="/aws_sbg.png"
                alt="AWS LPU"
                className="h-10 w-auto object-contain"
              />

              <div className="h-7 w-px bg-white/[0.12]" />

              <div>
                <p className="text-sm font-semibold tracking-wide">
                  AWS LPU SSO
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Administration
                </p>
              </div>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-10">
          <div className="border-b border-white/[0.08] pb-8">
            <Link
              href="/admin/clients"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600 transition hover:text-orange-400"
            >
              ← Back to Client Registry
            </Link>

            <div className="mt-6 flex items-start gap-4">
              <span className="mt-1 h-9 w-1 bg-emerald-500" />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Client Created
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                  {name}
                </h1>

                <p className="mt-3 text-sm text-zinc-600">
                  OAuth client registered successfully.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="border border-white/[0.08] bg-[#0c0c0c]">
              <div className="border-b border-white/[0.08] px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Client Identity
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Registration Details
                </h2>
              </div>

              <div className="divide-y divide-white/[0.07]">
                <div className="px-6 py-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Application Name
                  </p>

                  <p className="mt-2 text-sm text-zinc-300">
                    {name}
                  </p>
                </div>

                <div className="px-6 py-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Client ID
                  </p>

                  <code className="mt-2 block break-all border border-white/[0.07] bg-[#111111] px-3 py-2 font-mono text-[10px] leading-5 text-zinc-500">
                    {clientId}
                  </code>
                </div>
              </div>
            </section>

            <section className="border border-orange-400/10 bg-orange-400/[0.02]">
              <div className="border-b border-orange-400/10 px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-orange-400">
                  Credential Security
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Client Secret
                </h2>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm leading-6 text-zinc-500">
                  A client secret was generated during
                  registration and remains server-side.
                </p>

                <div className="mt-5 border border-orange-400/10 bg-[#0c0c0c] px-4 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                    Protected
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    The secret is not displayed or returned
                    to browser code.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-5 border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Redirect Configuration
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Registered Redirect URIs
              </h2>
            </div>

            <div className="space-y-2 px-6 py-5">
              {redirectUris
                .split("\n")
                .map((uri) => uri.trim())
                .filter(Boolean)
                .map((uri) => (
                  <div
                    key={uri}
                    className="border border-white/[0.07] bg-[#111111] px-3 py-3"
                  >
                    <code className="block break-all font-mono text-[10px] leading-5 text-zinc-500">
                      {uri}
                    </code>
                  </div>
                ))}
            </div>
          </div>

          <Link
            href="/admin/clients"
            className="mt-6 flex h-11 items-center justify-center bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
          >
            Back to Client Registry
          </Link>
        </div>

        <footer className="mt-10 border-t border-white/[0.08] bg-[#0a0a0a]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-10">
            <div className="flex items-center gap-3">
              <img
                src="/aws_sbg.png"
                alt="AWS LPU"
                className="h-7 w-auto object-contain opacity-70"
              />

              <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                AWS LPU Identity Services
              </span>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.16em] text-zinc-700 sm:block">
              OAuth Client Registry
            </span>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/[0.08] bg-[#0c0c0c]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/admin"
            className="flex items-center gap-4"
          >
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-auto object-contain"
            />

            <div className="h-7 w-px bg-white/[0.12]" />

            <div>
              <p className="text-sm font-semibold tracking-wide">
                AWS LPU SSO
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Administration
              </p>
            </div>
          </Link>

          <Link
            href="/admin/clients"
            className="flex h-10 items-center border border-white/[0.12] bg-[#101010] px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400 transition hover:border-white/[0.22] hover:text-white"
          >
            Back to Clients
          </Link>
        </div>
      </header>

      <div className="border-b border-orange-400/[0.08] bg-orange-400/[0.02]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-emerald-500" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              OAuth Client Registry
            </span>
          </div>

          <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
            Register Application
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-10">
        <div className="mb-8 border-b border-white/[0.08] pb-8">
          <Link
            href="/admin/clients"
            className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600 transition hover:text-orange-400"
          >
            ← Back to Client Registry
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span className="mt-1 h-9 w-1 bg-orange-400" />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                SSO Administration
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                Register Application
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Create a confidential OAuth client for
                applications using AWS LPU SSO.
              </p>
            </div>
          </div>
        </div>

        <section className="border border-white/[0.08] bg-[#0c0c0c]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Application Configuration
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Client Registration
            </h2>
          </div>

          <div className="space-y-6 px-6 py-6">
            <label className="block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                Application Name
              </span>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="SSO"
                className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
              />
            </label>

            <label className="block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                Client ID
              </span>

              <input
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                placeholder="sso_..."
                className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 font-mono text-xs text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
              />
            </label>

            <label className="block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                Redirect URIs
              </span>

              <textarea
                value={redirectUris}
                onChange={(event) =>
                  setRedirectUris(
                    event.target.value
                  )
                }
                placeholder={
                  "http://localhost:3000/test-client/callback"
                }
                rows={5}
                className="mt-2 w-full resize-y border border-white/[0.10] bg-[#111111] px-3 py-3 font-mono text-xs leading-5 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
              />

              <p className="mt-2 text-[10px] text-zinc-700">
                Add one redirect URI per line. HTTPS is
                required outside local development.
              </p>
            </label>
          </div>

          {error && (
            <div className="mx-6 mb-6 border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-red-400">
                Registration Failed
              </p>

              <p className="mt-1 text-xs text-red-400/80">
                {error}
              </p>
            </div>
          )}

          <div className="border-t border-white/[0.08] px-6 py-5">
            <button
              type="button"
              onClick={() => void createClient()}
              disabled={
                loading ||
                !name.trim() ||
                !clientId.trim() ||
                !redirectUris.trim()
              }
              className="flex h-11 w-full items-center justify-center bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Registering Client..."
                : "Register Application"}
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-10 border-t border-white/[0.08] bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-7 w-auto object-contain opacity-70"
            />

            <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
              AWS LPU Identity Services
            </span>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.16em] text-zinc-700 sm:block">
            OAuth Client Registry
          </span>
        </div>
      </footer>
    </main>
  );
}