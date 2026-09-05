import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LogoutButton from "@/components/LogoutButton";

async function updateProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const fullName =
    String(formData.get("full_name") ?? "").trim();

  const avatarUrl =
    String(formData.get("avatar_url") ?? "").trim();

  const workspaceName =
    String(
      formData.get("workspace_name") ?? ""
    ).trim();

  const workspaceUid =
    String(
      formData.get("workspace_uid") ?? ""
    ).trim();

  if (fullName.length > 100) {
    return;
  }

  if (avatarUrl.length > 500) {
    return;
  }

  if (workspaceName.length > 100) {
    return;
  }

  if (workspaceUid.length > 100) {
    return;
  }

  const adminSupabase =
    createAdminClient();

  await adminSupabase
    .from("profiles")
    .update({
      full_name:
        fullName || null,
      avatar_url:
        avatarUrl || null,
      workspace_name:
        workspaceName || null,
      workspace_uid:
        workspaceUid || null,
    })
    .eq("id", user.id);

  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="border border-white/8 bg-[#0d0d0d] px-8 py-7 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Authentication Required
          </p>
          <h1 className="mt-3 text-xl font-semibold">
            Sign in to continue
          </h1>
          <Link
            href="/login"
            className="mt-6 inline-flex h-10 items-center bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const adminSupabase =
    createAdminClient();

  const { data: profile } =
    await adminSupabase
      .from("profiles")
      .select(
        "id, full_name, email, role, avatar_url, created_at, workspace_name, workspace_uid"
      )
      .eq("id", user.id)
      .maybeSingle();

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "AWS LPU User";

  const email =
    profile?.email ||
    user.email ||
    "";

  const initials =
  displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/8 bg-[#0c0c0c]">
        <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-4"
          >
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-10 w-auto object-contain"
            />

            <div className="h-7 w-px bg-white/12" />

            <div>
              <p className="text-sm font-semibold tracking-wide">
                AWS LPU
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Identity Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="flex h-10 items-center border border-orange-400/30 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-orange-400 transition hover:bg-orange-400/[0.08]"
              >
                Admin Panel
              </Link>
            )}

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="border-b border-white/[0.07] bg-[#0a0a0a]">
        <div className="mx-auto flex h-11 max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-emerald-400" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Authenticated Session
            </span>
            <span className="text-xs text-zinc-300">
              {displayName}
            </span>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-zinc-700 sm:block">
            Identity Service Operational
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <div className="mb-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
            Identity Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Welcome, {displayName}.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage your AWS LPU identity and application profile.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] p-6">
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-16 w-16 border border-white/[0.10] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center border border-white/[0.10] bg-[#151515] text-lg font-semibold text-orange-400">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-600">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="border-b border-white/[0.07] pb-5">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                  Account Role
                </p>
                <p className="mt-2 text-sm font-medium capitalize text-zinc-300">
                  {profile?.role ?? "member"}
                </p>
              </div>

              <div className="pt-5">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                  Identity Provider
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  AWS LPU SSO
                </p>
              </div>
            </div>
          </aside>

          <section className="border border-white/[0.08] bg-[#0c0c0c]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Account
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Manage Your Profile
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Update your information below. Your SSO email cannot be changed here.
              </p>
            </div>

            <form
              action={updateProfile}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Full Name
                  </span>

                  <input
                    name="full_name"
                    type="text"
                    defaultValue={
                      profile?.full_name ?? ""
                    }
                    maxLength={100}
                    placeholder="Your full name"
                    className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Email
                  </span>

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="mt-2 h-11 w-full cursor-not-allowed border border-white/[0.06] bg-[#0a0a0a] px-3 text-sm text-zinc-500 outline-none"
                  />

                  <span className="mt-2 block text-[10px] text-zinc-700">
                    Managed by AWS LPU Identity Services
                  </span>
                </label>
              </div>

              <label className="block">
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Avatar URL
                </span>

                <input
                  name="avatar_url"
                  type="url"
                  defaultValue={
                    profile?.avatar_url ?? ""
                  }
                  maxLength={500}
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Workspace Name
                  </span>

                  <input
                    name="workspace_name"
                    type="text"
                    defaultValue={
                      profile?.workspace_name ?? ""
                    }
                    maxLength={100}
                    placeholder="Your workspace"
                    className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Workspace UID
                  </span>

                  <input
                    name="workspace_uid"
                    type="text"
                    defaultValue={
                      profile?.workspace_uid ?? ""
                    }
                    maxLength={100}
                    placeholder="Workspace identifier"
                    className="mt-2 h-11 w-full border border-white/[0.10] bg-[#111111] px-3 font-mono text-xs text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-orange-400/50"
                  />
                </label>
              </div>

              <div className="border-t border-white/[0.07] pt-6">
                <button
                  type="submit"
                  className="h-10 bg-white px-6 text-[9px] font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="border border-white/[0.08] bg-[#0c0c0c] p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
              Account ID
            </p>
            <p className="mt-3 break-all font-mono text-[11px] text-zinc-400">
              {user.id}
            </p>
          </div>

          <div className="border border-white/[0.08] bg-[#0c0c0c] p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
              Role
            </p>
            <p className="mt-3 text-sm font-medium capitalize text-zinc-300">
              {profile?.role ?? "member"}
            </p>
          </div>

          <div className="border border-white/[0.08] bg-[#0c0c0c] p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
              Member Since
            </p>
            <p className="mt-3 text-sm font-medium text-zinc-300">
              {profile?.created_at
                ? new Date(
                    profile.created_at
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "—"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}