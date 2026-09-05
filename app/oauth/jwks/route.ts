import { NextResponse } from "next/server";
import { getPublicJwk } from "@/lib/sso/jwks";

export async function GET() {
  return NextResponse.json(
    {
      keys: [await getPublicJwk()],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, immutable",
      },
    }
  );
}