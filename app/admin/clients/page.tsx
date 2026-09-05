"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SSOClient = {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<SSOClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/clients", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load clients"
        );
      }

      if (!Array.isArray(data.clients)) {
        throw new Error("Invalid clients response");
      }

      setClients(
        data.clients.map((client: SSOClient) => ({
          ...client,
          redirectUris: Array.isArray(client.redirectUris)
            ? client.redirectUris
            : [],
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load clients"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClients();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function toggleClient(client: SSOClient) {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/clients/${client.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            enabled: !client.enabled,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update client"
        );
      }

      if (!data.client) {
        throw new Error("Invalid client update response");
      }

      setClients((current) =>
        current.map((item) =>
          item.id === client.id ? data.client : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update client"
      );
    }
  }

  async function deleteClient(client: SSOClient) {
    const confirmed = window.confirm(
      `Delete "${client.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/admin/clients/${client.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete client"
        );
      }

      setClients((current) =>
        current.filter(
          (item) => item.id !== client.id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete client"
      );
    }
  }

  const activeClients = clients.filter(
    (client) => client.enabled
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

          <Link
            href="/admin/clients/new"
            className="flex h-10 items-center bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
          >
            + Add Client
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

          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-zinc-700 sm:block">
            {activeClients} active
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <div className="mb-8 flex flex-col gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600 transition hover:text-orange-400"
            >
              ← Back to Dashboard
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-7 w-1 bg-orange-400" />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                  Registered Applications
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                  OAuth Clients
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
              Manage applications that use AWS LPU SSO
              for authentication and identity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadClients()}
              disabled={loading}
              className="flex h-10 items-center border border-white/[0.12] bg-[#101010] px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400 transition hover:border-white/[0.22] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              href="/admin/clients/new"
              className="flex h-10 items-center bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
            >
              + Register Application
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-5 border border-red-500/20 bg-red-500/[0.04] px-5 py-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-red-400">
                Request failed
              </p>

              <p className="mt-1 text-xs text-red-400/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadClients()}
              className="border border-red-500/20 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-red-400 transition hover:bg-red-500/[0.06]"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 border border-white/[0.08] bg-[#0c0c0c] sm:grid-cols-3">
          <div className="border-r border-white/[0.08] px-5 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
              Total Clients
            </p>

            <p className="mt-3 text-2xl font-semibold">
              {clients.length}
            </p>
          </div>

          <div className="border-r border-white/[0.08] px-5 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
              Active
            </p>

            <p className="mt-3 text-2xl font-semibold text-emerald-400">
              {activeClients}
            </p>
          </div>

          <div className="col-span-2 px-5 py-5 sm:col-span-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-700">
              Disabled
            </p>

            <p className="mt-3 text-2xl font-semibold text-zinc-500">
              {clients.length - activeClients}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] px-6 py-4">
              <div className="h-3 w-32 animate-pulse bg-white/[0.06]" />
            </div>

            <div className="divide-y divide-white/[0.07]">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="grid gap-5 px-6 py-6 md:grid-cols-[1.1fr_1.4fr_1.5fr_110px_150px]"
                >
                  <div className="h-4 w-32 animate-pulse bg-white/[0.06]" />
                  <div className="h-4 w-52 animate-pulse bg-white/[0.06]" />
                  <div className="h-4 w-64 animate-pulse bg-white/[0.06]" />
                  <div className="h-6 w-20 animate-pulse bg-white/[0.06]" />
                  <div className="h-8 w-28 animate-pulse bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </div>
        ) : clients.length === 0 ? (
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
              Register First Application
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden border border-white/[0.08] bg-[#0a0a0a]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
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
                      className="transition hover:bg-[#101010]"
                    >
                      <td className="px-6 py-6 align-top">
                        <p className="text-sm font-medium text-zinc-200">
                          {client.name}
                        </p>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                          Created{" "}
                          {new Date(
                            client.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-6 py-6 align-top">
                        <code className="inline-block max-w-[280px] break-all border border-white/[0.07] bg-[#111111] px-3 py-2 font-mono text-[10px] leading-5 text-zinc-500">
                          {client.clientId}
                        </code>
                      </td>

                      <td className="px-6 py-6 align-top">
                        <div className="max-w-md space-y-2">
                          {client.redirectUris.length > 0 ? (
                            client.redirectUris.map((uri) => (
                              <div
                                key={uri}
                                className="border border-white/[0.06] bg-[#101010] px-3 py-2"
                              >
                                <p className="break-all font-mono text-[10px] leading-5 text-zinc-600">
                                  {uri}
                                </p>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-700">
                              No redirect URI
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-6 align-top">
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

                      <td className="px-6 py-6 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="inline-flex h-9 items-center border border-white/[0.12] px-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-400 transition hover:border-orange-400/30 hover:bg-orange-400/[0.04] hover:text-orange-400"
                          >
                            Manage →
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              void toggleClient(client)
                            }
                            className="inline-flex h-9 items-center border border-white/[0.10] px-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-600 transition hover:border-white/[0.2] hover:text-white"
                          >
                            {client.enabled
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteClient(client)
                            }
                            className="inline-flex h-9 items-center border border-red-500/15 px-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-red-400 transition hover:bg-red-500/[0.05]"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.08] bg-[#0c0c0c] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                  {clients.length} registered application
                  {clients.length === 1 ? "" : "s"}
                </p>

                <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                  AWS LPU SSO
                </p>
              </div>
            </div>
          </div>
        )}
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