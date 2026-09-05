import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSSOAdmin } from "@/lib/sso/admin";
import { getAllSSOClients } from "@/lib/sso/clients";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboard() {
  const {
    authorized,
    profile,
  } = await requireSSOAdmin();

  if (!authorized) {
    redirect("/login");
  }

  const clients = await getAllSSOClients();

  const activeClients = clients.filter(
    (client) => client.enabled
  ).length;

  const disabledClients = clients.filter(
    (client) => !client.enabled
  ).length;

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

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-zinc-300">
                {profile?.full_name ||
                  profile?.email ||
                  "Administrator"}
              </p>

              <p className="text-[9px] uppercase tracking-[0.16em] text-orange-400">
                Administrator
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="border-b border-orange-400/[0.08] bg-orange-400/[0.02]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-emerald-500" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              SSO Control Center
            </span>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-zinc-700 sm:block">
            Identity service operational
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <section className="border border-white/[0.08] bg-[#0c0c0c]">
          <div className="border-b border-white/[0.08] px-7 py-7 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-7 w-1 bg-orange-400" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                    Administration
                  </p>
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.025em]">
                  Welcome back,{" "}
                  {profile?.full_name ||
                    "Administrator"}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                  Manage applications connected to AWS LPU
                  Single Sign-On.
                </p>
              </div>

              <Link
                href="/admin/clients/new"
                className="flex h-11 shrink-0 items-center justify-center bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
              >
                + Add Client
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3">
            <StatCard
              label="Total Clients"
              value={clients.length}
              detail="Registered applications"
            />

            <StatCard
              label="Active Clients"
              value={activeClients}
              detail="Currently accepting requests"
              accent
            />

            <StatCard
              label="Disabled Clients"
              value={disabledClients}
              detail="Currently unavailable"
            />
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                Registered Applications
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                OAuth Clients
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Applications registered with AWS LPU SSO.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/clients"
                className="hidden h-10 items-center border border-white/[0.12] bg-[#101010] px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400 transition hover:border-white/[0.22] hover:text-white sm:flex"
              >
                View All Clients
              </Link>

              <Link
                href="/admin/clients/new"
                className="flex h-10 items-center bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
              >
                + Register Application
              </Link>
            </div>
          </div>
          
          {clients.length === 0 ? (
            <div className="border border-dashed border-white/[0.12] bg-[#0c0c0c] px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-orange-400/20 bg-orange-400/[0.04]">
                <span className="text-lg text-orange-400">
                  +
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-zinc-300">
                No OAuth clients registered
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Register an application to begin using AWS LPU SSO.
              </p>

              <Link
                href="/admin/clients/new"
                className="mt-6 inline-flex h-10 items-center bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
              >
                Add First Client
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden border border-white/[0.08]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-white/[0.08] bg-[#0c0c0c]">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Application
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Client ID
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Redirect URIs
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.07]">
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="bg-[#0a0a0a] transition hover:bg-[#101010]"
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-zinc-200">
                            {client.name}
                          </p>

                          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                            OAuth Application
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <code className="border border-white/[0.07] bg-[#111111] px-2.5 py-1.5 text-[10px] text-zinc-500">
                            {client.clientId}
                          </code>
                        </td>

                        <td className="px-6 py-5">
                          <div className="max-w-md space-y-2">
                            {client.redirectUris.map(
                              (uri) => (
                                <p
                                  key={uri}
                                  className="break-all font-mono text-[10px] leading-5 text-zinc-600"
                                >
                                  {uri}
                                </p>
                              )
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          {client.enabled ? (
                            <div className="inline-flex items-center gap-2 border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-1.5">
                              <span className="h-1.5 w-1.5 bg-emerald-500" />

                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 border border-red-400/10 bg-red-400/[0.04] px-2.5 py-1.5">
                              <span className="h-1.5 w-1.5 bg-red-500" />

                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-red-400">
                                Disabled
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="inline-flex h-9 items-center border border-white/[0.12] px-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition hover:border-orange-400/30 hover:bg-orange-400/[0.04] hover:text-orange-400"
                          >
                            Manage →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
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
            SSO Administration
          </span>
        </div>
      </footer>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: number;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className="border-r border-white/[0.08] px-7 py-7 last:border-r-0 sm:px-8">
      <div className="flex items-start justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          {label}
        </p>

        {accent && (
          <span className="h-1.5 w-1.5 bg-emerald-500" />
        )}
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-[10px] text-zinc-700">
        {detail}
      </p>
    </div>
  );
}