import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const returnTo = requestUrl.searchParams.get("returnTo");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error);

    return NextResponse.redirect(
      new URL(
        "/login?error=oauth_callback_failed",
        requestUrl.origin
      )
    );
  }

  const safeReturnTo =
    returnTo &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    !returnTo.startsWith("/\\")
      ? returnTo
      : "/";

  return NextResponse.redirect(
    new URL(safeReturnTo, requestUrl.origin)
  );
}