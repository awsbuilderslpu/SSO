"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      setLoading(false);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-50"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}