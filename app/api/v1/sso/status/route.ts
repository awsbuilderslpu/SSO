import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  try {
    const latency = Date.now() - startedAt;

    return NextResponse.json({
      success: true,
      service: "sso",
      status: "operational",
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const latency = Date.now() - startedAt;

    console.error("[SSO] Status check failed:", error);

    return NextResponse.json(
      {
        success: false,
        service: "sso",
        status: "down",
        latency,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}