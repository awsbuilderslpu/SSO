"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { SSOClientSummary } from "@/lib/sso/clients";

type Props = {
  client: SSOClientSummary;
};

export default function AdminClientEditor({ client }: Props) {
  const router = useRouter();
  const [name, setName] = useState(client.name);
  const [clientId, setClientId] = useState(client.clientId);
  const [redirectUris, setRedirectUris] = useState(
    client.redirectUris.join("\n")
  );
  const [enabled, setEnabled] = useState(client.enabled);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveChanges() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          clientId,
          redirectUris: redirectUris
            .split("\n")
            .map((uri) => uri.trim())
            .filter(Boolean),
          enabled,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update client");
      }

      const updatedClient = data.client as SSOClientSummary;
      setName(updatedClient.name);
      setClientId(updatedClient.clientId);
      setRedirectUris(updatedClient.redirectUris.join("\n"));
      setEnabled(updatedClient.enabled);
      setMessage("Client updated successfully.");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to update client"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient() {
    if (!window.confirm(`Delete "${name}"?\n\nThis cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete client");
      }

      router.push("/admin/clients");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to delete client"
      );
      setDeleting(false);
    }
  }

  return (
    <section className="mt-5 border border-white/[0.08] bg-[#0c0c0c]">
      <div className="border-b border-white/[0.08] px-6 py-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Manage Application
        </p>
        <h2 className="mt-2 text-lg font-semibold">
          Edit Client Configuration
        </h2>
      </div>

      <div className="space-y-5 px-6 py-6">
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
            Application Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 text-sm text-zinc-200 outline-none transition focus:border-orange-400/50"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
            Client ID
          </span>
          <input
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 font-mono text-xs text-zinc-200 outline-none transition focus:border-orange-400/50"
          />
        </label>

        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
            Redirect URIs
          </span>
          <textarea
            value={redirectUris}
            onChange={(event) => setRedirectUris(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-y border border-white/[0.10] bg-[#111111] px-3 py-3 font-mono text-xs leading-5 text-zinc-200 outline-none transition focus:border-orange-400/50"
          />
        </label>

        <label className="flex items-center gap-3 border border-white/[0.08] bg-[#111111] px-3 py-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-4 w-4 accent-orange-400"
          />
          <span className="text-xs text-zinc-300">
            Client enabled
          </span>
        </label>

        {error && (
          <p className="border border-red-500/20 bg-red-500/[0.04] px-3 py-3 text-xs text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p className="border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-3 text-xs text-emerald-400">
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void saveChanges()}
            disabled={saving || deleting}
            className="h-10 bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => void deleteClient()}
            disabled={saving || deleting}
            className="h-10 border border-red-500/20 px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-500/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Client"}
          </button>
        </div>
      </div>
    </section>
  );
}
