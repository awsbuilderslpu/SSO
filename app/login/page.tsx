"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    const safeReturnTo =
      returnTo &&
      returnTo.startsWith("/") &&
      !returnTo.startsWith("//") &&
      !returnTo.startsWith("/\\")
        ? returnTo
        : "/";

    window.location.href = safeReturnTo;
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    const callbackUrl = new URL(
      "/auth/callback",
      window.location.origin
    );

    if (returnTo) {
      callbackUrl.searchParams.set("returnTo", returnTo);
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
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
              <p className="text-sm font-semibold tracking-wide text-white">
                AWS LPU
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Identity Platform
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600 sm:flex">
            <span className="h-1.5 w-1.5 bg-orange-400" />
            Secure Identity Service
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] lg:grid-cols-[1fr_1px_1fr]">
        <section className="hidden flex-col justify-center px-10 py-16 lg:flex xl:px-20">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-8 w-1 bg-orange-400" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400">
                  Authentication Gateway
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Centralized access for AWS LPU applications
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.035em] xl:text-6xl">
              One identity.
              <br />
              <span className="text-zinc-500">Every application.</span>
            </h1>

            <p className="mt-8 max-w-lg border-l border-white/[0.10] pl-5 text-sm leading-7 text-zinc-500">
              Authenticate once and securely access connected AWS LPU
              applications using a centralized identity.
            </p>

            <div className="mt-12 grid grid-cols-2 border border-white/[0.08] bg-[#0d0d0d]">
              <div className="border-r border-white/[0.08] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Service
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  AWS LPU SSO
                </p>
              </div>

              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Protocol
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  OAuth 2.0 / OIDC
                </p>
              </div>

              <div className="border-t border-white/[0.08] border-r border-white/[0.08] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Identity
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  Centralized
                </p>
              </div>

              <div className="border-t border-white/[0.08] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Access
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  Application-based
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="hidden bg-white/[0.08] lg:block" />

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-[440px]">
            <div className="border border-white/[0.10] bg-[#0d0d0d] shadow-2xl shadow-black/30">
              <div className="border-b border-white/[0.08] px-7 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                      Identity Access
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Sign in
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Authenticate with your AWS LPU account.
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center border border-orange-400/20 bg-orange-400/[0.05]">
                    <span className="h-2 w-2 bg-orange-400" />
                  </div>
                </div>
              </div>

              <div className="px-7 py-7 sm:px-8">
                {error && (
                  <div className="mb-6 border border-red-500/20 bg-red-500/[0.05] px-4 py-3">
                    <p className="text-xs leading-5 text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || googleLoading}
                  className="flex h-12 w-full items-center justify-center gap-3 border border-white/[0.12] bg-[#111111] px-4 text-sm font-medium text-zinc-200 transition hover:border-white/[0.22] hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {googleLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.54 13.84A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.63H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.37l3.24-2.53Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 6.13c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 7.85 9.46 6.13 12 6.13Z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}

                  {googleLoading
                    ? "Connecting..."
                    : "Continue with Google"}
                </button>

                <div className="my-7 flex items-center">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="px-4 text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                    Or sign in with credentials
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      disabled={loading || googleLoading}
                      required
                      className="h-12 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-400/60 focus:bg-[#0b0b0b] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      disabled={loading || googleLoading}
                      required
                      className="h-12 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-400/60 focus:bg-[#0b0b0b] disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="group flex h-12 w-full items-center justify-center gap-2 bg-white px-4 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
                    )}

                    <span>
                      {loading ? "Signing in..." : "Sign in"}
                    </span>

                    {!loading && (
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </form>
              </div>

              <div className="border-t border-white/[0.08] bg-[#0a0a0a] px-7 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-emerald-500" />
                    <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                      Identity service operational
                    </span>
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                    SSO
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.16em] text-zinc-700">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="1"
                />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              AWS LPU Identity Services
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}