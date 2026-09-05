import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
    redirect("/login");
  }

  const fullName =
    String(formData.get("full_name") ?? "").trim();

  const avatarUrl =
    String(formData.get("avatar_url") ?? "").trim();

  const workspaceName =
    String(formData.get("workspace_name") ?? "").trim();

  const workspaceUid =
    String(formData.get("workspace_uid") ?? "").trim();

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

  const adminSupabase = createAdminClient();

  const { data: existingProfile } =
    await adminSupabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

  const profileData = {
    id: user.id,
    full_name:
      fullName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      null,
    email: user.email ?? null,
    avatar_url:
      avatarUrl ||
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null,
    workspace_name:
      workspaceName || null,
    workspace_uid:
      workspaceUid || null,
  };

  if (!existingProfile) {
    const { error } =
      await adminSupabase
        .from("profiles")
        .insert({
          ...profileData,
          role: "member",
        });

    if (error) {
      console.error(
        "Failed to create profile:",
        error
      );

      throw new Error(
        "Failed to create profile"
      );
    }
  } else {
    const { error } =
      await adminSupabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);

    if (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      throw new Error(
        "Failed to update profile"
      );
    }
  }

  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
      .map(
        (part: string) =>
          part[0]
      )
      .join("")
      .toUpperCase() || "U";

  const memberSince =
    profile?.created_at
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
      : "Just now";

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

          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-zinc-300">
                {displayName}
              </p>

              <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                {profile?.role || "member"}
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-6 w-1 bg-orange-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                Account
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Your Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-600">
              Manage your AWS LPU identity and account information.
            </p>
          </div>

          <div className="hidden border border-white/[0.08] bg-[#0d0d0d] px-5 py-3 sm:block">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
              Identity Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500" />

              <span className="text-xs font-medium text-zinc-300">
                Authenticated
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="border border-white/[0.08] bg-[#0d0d0d]">
            <div className="border-b border-white/[0.08] p-6">
              <div className="flex h-20 w-20 items-center justify-center border border-orange-400/30 bg-orange-400/[0.05] text-2xl font-semibold text-orange-400">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {displayName}
              </h2>

              <p className="mt-1 break-all text-xs text-zinc-600">
                {email}
              </p>
            </div>

            <div className="grid grid-cols-2">
              <div className="border-r border-white/[0.08] p-5">
                <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                  Role
                </p>

                <p className="mt-2 text-sm font-medium capitalize text-zinc-300">
                  {profile?.role || "member"}
                </p>
              </div>

              <div className="p-5">
                <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                  Member Since
                </p>

                <p className="mt-2 text-xs font-medium text-zinc-300">
                  {memberSince}
                </p>
              </div>
            </div>

            {profile?.role === "admin" && (
              <div className="border-t border-white/[0.08] p-5">
                <a
                  href="/admin"
                  className="flex h-10 items-center justify-center border border-white/[0.12] bg-[#101010] text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:border-orange-400/40 hover:text-orange-400"
                >
                  Open Admin Console
                </a>
              </div>
            )}
          </aside>

          <section className="border border-white/[0.08] bg-[#0d0d0d]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                Profile Information
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Manage your identity
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Update the information associated with your AWS LPU account.
              </p>
            </div>

            <form
              action={updateProfile}
              className="p-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    defaultValue={
                      profile?.full_name ||
                      user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      ""
                    }
                    maxLength={100}
                    className="h-11 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    value={email}
                    readOnly
                    className="h-11 w-full border border-white/[0.06] bg-[#070707] px-4 text-sm text-zinc-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="avatar_url"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Avatar URL
                  </label>

                  <input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    defaultValue={
                      profile?.avatar_url ||
                      user.user_metadata?.avatar_url ||
                      user.user_metadata?.picture ||
                      ""
                    }
                    maxLength={500}
                    placeholder="https://..."
                    className="h-11 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="workspace_name"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Workspace Name
                  </label>

                  <input
                    id="workspace_name"
                    name="workspace_name"
                    defaultValue={
                      profile?.workspace_name ||
                      ""
                    }
                    maxLength={100}
                    placeholder="AWS LPU"
                    className="h-11 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="workspace_uid"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Workspace UID
                  </label>

                  <input
                    id="workspace_uid"
                    name="workspace_uid"
                    defaultValue={
                      profile?.workspace_uid ||
                      ""
                    }
                    maxLength={100}
                    placeholder="workspace-id"
                    className="h-11 w-full border border-white/[0.10] bg-[#090909] px-4 text-sm text-white outline-none transition focus:border-orange-400/60"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-6">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                    Account ID
                  </p>

                  <p className="mt-1 max-w-[420px] truncate font-mono text-[10px] text-zinc-500">
                    {user.id}
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex h-11 bg-white px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-orange-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}