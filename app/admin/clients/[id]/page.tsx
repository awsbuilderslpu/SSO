import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireSSOAdmin } from "@/lib/sso/admin";
import {
  getSSOClientById,
  toSSOClientSummary,
} from "@/lib/sso/clients";
import AdminClientEditor from "@/components/AdminClientEditor";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailsPage({
  params,
}: Props) {
  const { authorized } = await requireSSOAdmin();

  if (!authorized) {
    redirect("/login");
  }

  const { id } = await params;

  const client = await getSSOClientById(id);

  if (!client) {
    notFound();
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
            Client Details
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-10 lg:px-10">
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
                Registered Application
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                {client.name}
              </h1>

              <code className="mt-3 block break-all font-mono text-xs text-zinc-600">
                {client.clientId}
              </code>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className="border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Application Configuration
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Client Information
              </h2>
            </div>

            <div className="divide-y divide-white/[0.07]">
              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Application Name
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {client.name}
                </p>
              </div>

              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Client ID
                </p>

                <code className="mt-2 block break-all border border-white/[0.07] bg-[#111111] px-3 py-2 font-mono text-[10px] leading-5 text-zinc-500">
                  {client.clientId}
                </code>
              </div>

              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Redirect URIs
                </p>

                <div className="mt-3 space-y-2">
                  {client.redirectUris.length > 0 ? (
                    client.redirectUris.map((uri) => (
                      <div
                        key={uri}
                        className="border border-white/[0.07] bg-[#111111] px-3 py-3"
                      >
                        <code className="block break-all font-mono text-[10px] leading-5 text-zinc-500">
                          {uri}
                        </code>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-zinc-700">
                      No redirect URIs registered.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Registry Status
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Client Status
              </h2>
            </div>

            <div className="divide-y divide-white/[0.07]">
              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Current Status
                </p>

                <div className="mt-3">
                  {client.enabled ? (
                    <div className="inline-flex items-center gap-2 border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2">
                      <span className="h-1.5 w-1.5 bg-emerald-500" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 border border-red-400/10 bg-red-400/[0.04] px-3 py-2">
                      <span className="h-1.5 w-1.5 bg-red-500" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-red-400">
                        Disabled
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Created
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  {new Date(
                    client.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Last Updated
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  {new Date(
                    client.updatedAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        </div>

        <AdminClientEditor client={toSSOClientSummary(client)} />

        <div className="mt-5 border border-orange-400/10 bg-orange-400/[0.02] px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 bg-orange-400" />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                Security Notice
              </p>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Client credentials are intentionally not displayed in
                the administration interface.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/[0.08] bg-[#0a0a0a]">
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