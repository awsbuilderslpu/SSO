"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateAccountPage() {
  const [fullName, setFullName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUid, setWorkspaceUid] = useState("");
  const [email, setEmail] = useState("");
  const [returnTo, setReturnTo] = useState("/");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.replace("/login");
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const requestedReturnTo =
        params.get("returnTo");

      if (
        requestedReturnTo &&
        requestedReturnTo.startsWith("/") &&
        !requestedReturnTo.startsWith("//") &&
        !requestedReturnTo.startsWith("/\\")
      ) {
        setReturnTo(requestedReturnTo);
      }

      const metadata =
        user.user_metadata ?? {};

      setEmail(user.email ?? "");

      setFullName(
        metadata.full_name ||
          metadata.name ||
          ""
      );

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleCreateAccount(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreating(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.replace("/login");
      return;
    }

    const cleanFullName =
      fullName.trim();

    const cleanWorkspaceName =
      workspaceName.trim();

    const cleanWorkspaceUid =
      workspaceUid.trim();

    if (!cleanFullName) {
      setError(
        "Please enter your full name."
      );
      setCreating(false);
      return;
    }

    if (cleanFullName.length > 100) {
      setError(
        "Full name is too long."
      );
      setCreating(false);
      return;
    }

    if (cleanWorkspaceName.length > 100) {
      setError(
        "Workspace name is too long."
      );
      setCreating(false);
      return;
    }

    if (cleanWorkspaceUid.length > 100) {
      setError(
        "Workspace UID is too long."
      );
      setCreating(false);
      return;
    }

    const response = await fetch(
      "/api/account/create",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          fullName:
            cleanFullName,
          workspaceName:
            cleanWorkspaceName,
          workspaceUid:
            cleanWorkspaceUid,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      setError(
        result.error ||
          "Failed to create account."
      );
      setCreating(false);
      return;
    }

    window.location.replace(
      returnTo
    );
  }

  async function handleCancel() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.replace(
      "/"
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
          <span className="h-1.5 w-1.5 animate-pulse bg-orange-400" />
          Loading identity
        </div>
      </main>
    );
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
                Identity Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            <span className="h-1.5 w-1.5 bg-orange-400" />
            Account Setup
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1440px] items-center justify-center px-5 py-12">
        <div className="w-full max-w-[520px]">
          <div className="border border-white/[0.10] bg-[#0d0d0d]">
            <div className="border-b border-white/[0.08] px-7 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="h-9 w-1 bg-orange-400" />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                    Account Required
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                    Create your AWS LPU account
                  </h1>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Your Google identity has been authenticated, but no AWS
                    LPU account exists yet.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={
                handleCreateAccount
              }
              className="px-7 py-7 sm:px-8"
            >
              {error && (
                <div className="mb-6 border border-red-500/20 bg-red-500/[0.05] px-4 py-3">
                  <p className="text-xs leading-5 text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <div className="mb-6 border border-orange-400/20 bg-orange-400/[0.04] px-4 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                  Authenticated Identity
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {email}
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  This email is linked to your AWS LPU identity.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    maxLength={100}
                    required
                    className="h-12 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="workspace_name"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Workspace Name
                    <span className="ml-2 font-normal text-zinc-700">
                      Optional
                    </span>
                  </label>

                  <input
                    id="workspace_name"
                    value={
                      workspaceName
                    }
                    onChange={(event) =>
                      setWorkspaceName(
                        event.target.value
                      )
                    }
                    maxLength={100}
                    placeholder="AWS LPU"
                    className="h-12 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="workspace_uid"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Workspace UID
                    <span className="ml-2 font-normal text-zinc-700">
                      Optional
                    </span>
                  </label>

                  <input
                    id="workspace_uid"
                    value={workspaceUid}
                    onChange={(event) =>
                      setWorkspaceUid(
                        event.target.value
                      )
                    }
                    maxLength={100}
                    placeholder="workspace-id"
                    className="h-12 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-emerald-500" />

                  <p className="text-[10px] leading-5 text-zinc-600">
                    Your account will be created with standard member
                    access. Administrator access cannot be assigned during
                    self-registration.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={
                      handleCancel
                    }
                    disabled={creating}
                    className="flex h-11 flex-1 items-center justify-center border border-white/[0.12] bg-[#101010] text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500 transition hover:border-white/[0.22] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="flex h-11 flex-1 items-center justify-center bg-white text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating
                      ? "Creating..."
                      : "Create Account →"}
                  </button>
                </div>
              </div>
            </form>

            <div className="border-t border-white/[0.08] bg-[#0a0a0a] px-7 py-4 sm:px-8">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                  AWS LPU Identity
                </span>

                <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                  OAuth 2.0 / OIDC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}