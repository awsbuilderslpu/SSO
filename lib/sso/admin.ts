import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireSSOAdmin() {
  const supabase = await createClient();

  // Get currently logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      user: null,
      profile: null,
    };
  }

  // Get user's profile
  const adminSupabase =
    createAdminClient();

  const {
    data: profile,
    error: profileError,
  } = await adminSupabase
    .from("profiles")
    .select(
      "id, full_name, email, role, avatar_url, workspace_name, workspace_uid"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Failed to load admin profile:",
      profileError
    );

    return {
      authorized: false,
      user,
      profile: null,
    };
  }

  // Check role
  if (
    !profile ||
    profile.role !== "admin"
  ) {
    return {
      authorized: false,
      user,
      profile,
    };
  }

  return {
    authorized: true,
    user,
    profile,
  };
}