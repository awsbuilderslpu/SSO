import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "You must be signed in.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const workspaceName =
      typeof body.workspaceName === "string"
        ? body.workspaceName.trim()
        : "";

    const workspaceUid =
      typeof body.workspaceUid === "string"
        ? body.workspaceUid.trim()
        : "";

    if (!fullName) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (fullName.length > 100) {
      return NextResponse.json(
        {
          error: "Full name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (workspaceName.length > 100) {
      return NextResponse.json(
        {
          error: "Workspace name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (workspaceUid.length > 100) {
      return NextResponse.json(
        {
          error: "Workspace UID is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const adminSupabase =
      createAdminClient();

    const { data: existingProfile } =
      await adminSupabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        {
          error: "Account already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const metadata =
      user.user_metadata ?? {};

    const avatarUrl =
      typeof metadata.avatar_url === "string"
        ? metadata.avatar_url
        : typeof metadata.picture === "string"
          ? metadata.picture
          : null;

    const { data: profile, error } =
        await adminSupabase
            .from("profiles")
            .insert({
            id: user.id,
            full_name: fullName,
            email: user.email ?? null,
            avatar_url: avatarUrl,
            workspace_name:
                workspaceName || null,
            workspace_uid:
                workspaceUid || null,
            })
            .select(
            "id, full_name, email, role, avatar_url, workspace_name, workspace_uid"
            )
            .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Account already exists.",
          },
          {
            status: 409,
          }
        );
      }

      console.error(
        "Failed to create account:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to create account.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        profile,
      },
      {
        status: 201,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Account creation error:",
      error
    );

    return NextResponse.json(
      {
        error: "Account creation failed.",
      },
      {
        status: 500,
      }
    );
  }
}