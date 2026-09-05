import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function getSafeReturnTo(value: string | null) {
  if (!value) {
    return "/";
  }

  try {
    const decoded = decodeURIComponent(value);

    if (
      decoded.startsWith("/") &&
      !decoded.startsWith("//") &&
      !decoded.startsWith("/\\")
    ) {
      return decoded;
    }
  } catch {}

  return "/";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code =
    requestUrl.searchParams.get("code");

  const cookieValue =
    request.headers
      .get("cookie")
      ?.match(
        /(?:^|;\s*)sso_return_to=([^;]*)/
      )?.[1] ?? null;

  const queryReturnTo =
    requestUrl.searchParams.get("returnTo");

  const returnTo = getSafeReturnTo(
    cookieValue
      ? decodeURIComponent(cookieValue)
      : queryReturnTo
  );

  if (!code) {
    const loginUrl = new URL(
      "/login",
      requestUrl.origin
    );

    loginUrl.searchParams.set(
      "error",
      "missing_code"
    );

    loginUrl.searchParams.set(
      "returnTo",
      returnTo
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code
    );

  if (error) {
    console.error(
      "OAuth callback error:",
      error
    );

    const loginUrl = new URL(
      "/login",
      requestUrl.origin
    );

    loginUrl.searchParams.set(
      "error",
      "oauth_callback_failed"
    );

    loginUrl.searchParams.set(
      "returnTo",
      returnTo
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/login",
        requestUrl.origin
      )
    );
  }

  const adminSupabase =
    createAdminClient();

  const { data: profile } =
    await adminSupabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

  if (!profile) {
    const accountUrl = new URL(
      "/account/create",
      requestUrl.origin
    );

    accountUrl.searchParams.set(
      "returnTo",
      returnTo
    );

    const response =
      NextResponse.redirect(
        accountUrl
      );

    response.cookies.set(
      "sso_return_to",
      "",
      {
        path: "/",
        maxAge: 0,
      }
    );

    return response;
  }

  const response =
    NextResponse.redirect(
      new URL(
        returnTo,
        requestUrl.origin
      )
    );

  response.cookies.set(
    "sso_return_to",
    "",
    {
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}