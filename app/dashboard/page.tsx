import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-75 h-175 w-275 -translate-x-1/2 rounded-full bg-orange-500/8 blur-[160px]" />

        <div className="absolute -bottom-75 -left-62.5 h-150 w-150 rounded-full bg-orange-400/4 blur-[150px]" />

        <div className="absolute -right-50 -top-75 h-125 w-125 rounded-full bg-orange-500/[0.035] blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-4"
          >
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-auto object-contain"
            />

            <div>
              <p className="text-sm font-semibold">
                AWS LPU
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                Identity Services
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-orange-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/5 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-orange-300">
                AWS LPU Identity Platform
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-7xl">
              One identity.
              <br />

              <span className="text-zinc-500">
                Every application.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
              AWS LPU Identity Services provides a secure
              and unified way to access applications across
              the AWS LPU ecosystem.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                Continue with AWS LPU

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-xl border border-white/8 bg-white/1.5 px-6 py-4 text-sm font-medium text-zinc-300 transition hover:bg-white/20 hover:text-white"
              >
                Manage your profile
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0d0d0d] shadow-2xl shadow-black/40">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-white/6 p-7 sm:p-10 lg:border-b-0 lg:border-r">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-orange-400">
                    Your identity
                  </p>

                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                    Built around one secure account.
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                    Sign in once and securely access
                    applications connected to the AWS LPU
                    ecosystem without managing separate
                    credentials everywhere.
                  </p>

                  <div className="mt-8 space-y-3">
                    <Feature
                      title="Unified access"
                      description="One account across connected applications."
                    />

                    <Feature
                      title="Secure authentication"
                      description="Your password stays with the identity service."
                    />

                    <Feature
                      title="Your profile"
                      description="Manage your personal identity information."
                    />
                  </div>
                </div>

                <div className="bg-white/1.5 p-7 sm:p-10">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    Platform
                  </p>

                  <div className="mt-6 space-y-4">
                    <PlatformRow
                      label="Authentication"
                      value="OAuth 2.0"
                    />

                    <PlatformRow
                      label="Identity"
                      value="OpenID Connect"
                    />

                    <PlatformRow
                      label="Token signing"
                      value="RS256"
                    />

                    <PlatformRow
                      label="Security"
                      value="PKCE Enabled"
                    />
                  </div>

                  <div className="mt-8 border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/6">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4 text-emerald-400"
                        >
                          <path
                            d="m5 12.5 4.2 4.5L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <div>
                        <p className="text-xs font-medium text-zinc-300">
                          Identity services operational
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                          Secure authentication infrastructure
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mx-auto mt-24 max-w-5xl">
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-orange-400">
                Connected ecosystem
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
                One login. Multiple experiences.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                Applications connected to AWS LPU Identity
                Services can securely recognize your account.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <ApplicationCard
                title="Mock Exams"
                description="Practice and assessment platform"
              />

              <ApplicationCard
                title="AWS LPU Platform"
                description="Connected student experiences"
              />

              <ApplicationCard
                title="More coming"
                description="Growing AWS LPU ecosystem"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-7 text-xs text-zinc-700 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} AWS LPU
          </p>

          <div className="flex gap-5">
            <Link
              href="/login"
              className="transition hover:text-zinc-400"
            >
              Sign in
            </Link>

            <Link
              href="/dashboard"
              className="transition hover:text-zinc-400"
            >
              Account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 border border-white/8 bg-white/1.5 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-orange-400/15 bg-orange-400/4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-orange-400"
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function PlatformRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 pb-4">
      <span className="text-xs text-zinc-600">
        {label}
      </span>

      <span className="font-mono text-xs text-zinc-300">
        {value}
      </span>
    </div>
  );
}

function ApplicationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-white/8 bg-[#0d0d0d] p-6 transition hover:border-orange-400/20 hover:bg-white/20">
      <div className="flex h-10 w-10 items-center justify-center border border-white/8 bg-white/3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-zinc-400"
        >
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M9 12h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}