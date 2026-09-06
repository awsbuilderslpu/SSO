import Link from "next/link";

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Shield() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Apps() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

function Code() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 9-3 3 3 3" />
      <path d="m16 9 3 3-3 3" />
      <path d="m14 5-4 14" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 -top-95 h-175 max-w-225 -translate-x-1/2 rounded-full bg-orange-500/6 blur-[180px]" />

        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      <header className="relative z-10 border-b border-white/8">
        <div className="mx-auto flex h-19 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-4"
          >
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-10 object-contain"
            />

            <div>
              <p className="text-sm font-semibold text-zinc-200">
                AWS LPU
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                Identity Services
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 transition hover:text-zinc-300 sm:block"
            >
              Docs
            </Link>

            <Link
              href="/login"
              className="border border-white/12 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center px-6">
        <div className="w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <div className="flex items-center gap-3 border border-white/8 bg-white/2 px-4 py-2">
                <span className="h-1.5 w-1.5 bg-orange-400" />

                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  AWS LPU Identity Platform
                </span>
              </div>
            </div>

            <h1 className="mt-9 text-5xl font-medium tracking-[-0.055em] text-zinc-100 sm:text-6xl lg:text-7xl">
              One Identity.
              <span className="block text-zinc-500">
                Every Application.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
              A single identity for secure access across
              the AWS LPU ecosystem.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 bg-white px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
              >
                Continue with AWS LPU

                <Arrow />
              </Link>

              <Link
                href="/docs"
                className="flex items-center justify-center gap-3 border border-white/10 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition hover:border-white/20 hover:text-white"
              >
                Developer Docs
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl border border-white/8 md:grid-cols-3">
            <div className="border-b border-white/8 p-7 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-400">
                <Shield />
              </div>

              <h2 className="mt-6 text-sm font-medium text-zinc-200">
                Secure Authentication
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Modern OAuth 2.0 and OpenID Connect
                authentication.
              </p>
            </div>

            <div className="border-b border-white/8 p-7 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-400">
                <Apps />
              </div>

              <h2 className="mt-6 text-sm font-medium text-zinc-200">
                Unified Access
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                One AWS LPU account across connected
                applications.
              </p>
            </div>

            <div className="p-7">
              <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-400">
                <Code />
              </div>

              <h2 className="mt-6 text-sm font-medium text-zinc-200">
                Developer Ready
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Integrate applications using our OAuth
                and OpenID Connect endpoints.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-5xl flex-col justify-between gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
              AWS LPU Identity Services
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/docs"
                className="text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition hover:text-zinc-400"
              >
                Documentation
              </Link>

              <Link
                href="/login"
                className="text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition hover:text-zinc-400"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}