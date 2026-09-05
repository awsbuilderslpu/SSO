import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LogoutButton from "@/components/LogoutButton";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const adminSupabase = createAdminClient();

    const { data } = await adminSupabase
      .from("profiles")
      .select("full_name, email, role, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const email =
    profile?.email ||
    user?.email ||
    "";

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const isAdmin =
    profile?.role === "admin";

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/[0.08] bg-[#0c0c0c]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
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
                AWS LPU
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Identity Platform
              </p>
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 border border-white/[0.09] bg-[#111111] px-3 py-2 sm:flex">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-8 w-8 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center bg-white text-xs font-bold text-black">
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="max-w-[160px]">
                  <p className="truncate text-xs font-medium text-white">
                    {displayName}
                  </p>

                  <p className="truncate text-[10px] text-zinc-600">
                    {email}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden border border-orange-400/20 bg-orange-400/[0.05] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-orange-400 transition hover:bg-orange-400/[0.1] sm:block"
                >
                  Admin Panel
                </Link>
              )}

              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="border border-white/[0.08] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 transition hover:border-white/[0.16] hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/test-client"
                className="bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-orange-400"
              >
                SSO Demo
              </Link>
            </div>
          )}
        </div>
      </header>

      {user && (
        <div className="border-b border-orange-400/[0.10] bg-orange-400/[0.025]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-emerald-500" />

              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                Authenticated session
              </p>

              <span className="text-xs text-zinc-400">
                {displayName}
              </span>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-zinc-700 sm:block">
              Identity service operational
            </span>
          </div>
        </div>
      )}

      <section className="border-b border-white/[0.08]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_360px]">
          <div className="border-r border-white/[0.08] px-6 py-20 sm:px-10 sm:py-28 lg:px-16 xl:px-20">
            <div className="max-w-4xl">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-8 w-1 bg-orange-400" />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400">
                    Authentication Gateway
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    AWS LPU Identity Services
                  </p>
                </div>
              </div>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl xl:text-8xl">
                One identity.
                <br />
                <span className="text-zinc-500">
                  Every application.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl border-l border-white/[0.12] pl-5 text-sm leading-7 text-zinc-500 sm:text-base">
                A centralized identity platform for secure access
                across the AWS LPU application ecosystem.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {user ? (
                  <>
                    <Link
                      href={
                        isAdmin
                          ? "/admin"
                          : "/test-client"
                      }
                      className="group flex h-12 items-center justify-center gap-3 bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-orange-400"
                    >
                      {isAdmin
                        ? "Open Admin Panel"
                        : "Continue to application"}

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                    <Link
                      href="/test-client"
                      className="flex h-12 items-center justify-center border border-white/[0.12] bg-[#101010] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300 transition hover:border-white/[0.22] hover:text-white"
                    >
                      Explore SSO Demo
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="group flex h-12 items-center justify-center gap-3 bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-orange-400"
                    >
                      Sign in to AWS LPU

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                    <Link
                      href="/test-client"
                      className="flex h-12 items-center justify-center border border-white/[0.12] bg-[#101010] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300 transition hover:border-white/[0.22] hover:text-white"
                    >
                      Explore SSO Demo
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="border-b border-white/[0.08] px-8 py-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Platform Status
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-2 w-2 bg-emerald-500" />

                <span className="text-sm text-zinc-300">
                  Operational
                </span>
              </div>
            </div>

            <div className="border-b border-white/[0.08] px-8 py-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Protocol
              </p>

              <p className="mt-4 text-lg font-medium text-zinc-300">
                OAuth 2.0 / OIDC
              </p>
            </div>

            <div className="border-b border-white/[0.08] px-8 py-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Authorization
              </p>

              <p className="mt-4 text-lg font-medium text-zinc-300">
                PKCE
              </p>
            </div>

            <div className="px-8 py-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Identity
              </p>

              <p className="mt-4 text-lg font-medium text-zinc-300">
                Centralized
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid md:grid-cols-3">
            <FeatureCard
              number="01"
              label="Identity"
              title="Centralized identity"
              description="One account provides access across connected AWS LPU applications."
            />

            <FeatureCard
              number="02"
              label="Security"
              title="Secure authentication"
              description="OAuth, PKCE and centralized sessions keep authentication handled by one trusted identity layer."
            />

            <FeatureCard
              number="03"
              label="Integration"
              title="Application ready"
              description="Connected applications can rely on the identity provider instead of managing user credentials."
            />
          </div>
        </div>
      </section>

      {user && (
        <section className="border-b border-white/[0.08]">
          <div className="mx-auto max-w-[1440px]">
            <div className="border-b border-white/[0.08] px-6 py-6 sm:px-10 lg:px-16">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                    Current session
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Your AWS LPU identity is currently authenticated.
                  </p>
                </div>

                <div className="flex items-center gap-2 border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2">
                  <span className="h-1.5 w-1.5 bg-emerald-500" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
                    Authenticated
                  </span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3">
              <SessionItem
                label="Account"
                value={displayName}
              />

              <SessionItem
                label="Email"
                value={email}
              />

              <SessionItem
                label="Access"
                value={
                  isAdmin
                    ? "Administrator"
                    : "Member"
                }
              />
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-8 border border-white/[0.08] bg-[#0c0c0c] p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                Integration
              </p>

              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                One identity layer for connected applications.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                Applications authenticate through the same centralized
                identity service instead of maintaining separate credentials.
              </p>
            </div>

            <Link
              href="/test-client"
              className="flex h-11 shrink-0 items-center justify-center border border-white/[0.12] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-orange-400/40 hover:bg-orange-400/[0.05] hover:text-orange-400"
            >
              View SSO Demo →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-7 text-[10px] uppercase tracking-[0.14em] text-zinc-700 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-7 w-auto object-contain opacity-70"
            />

            <span>
              AWS LPU Identity Services
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span>OAuth 2.0</span>
            <span>OpenID Connect</span>
            <span>PKCE</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-r border-white/[0.08] px-7 py-8 last:border-r-0 lg:px-10 lg:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center border border-orange-400/20 bg-orange-400/[0.05] text-xs font-semibold text-orange-400">
          {number}
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
          {label}
        </span>
      </div>

      <h3 className="text-lg font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function SessionItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/[0.08] px-6 py-6 last:border-r-0 sm:px-10">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
        {label}
      </p>

      <p className="mt-3 truncate text-sm font-medium text-zinc-300">
        {value}
      </p>
    </div>
  );
}