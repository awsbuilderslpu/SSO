import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  try {
    const response = await fetch(
      "https://status.mailtrap.info/api/v1/status",
      {
        cache: "no-store",
      }
    );

    const latency = Date.now() - startedAt;

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          service: "mail",
          provider: "mailtrap",
          status: "unknown",
          latency,
          error: "Unable to fetch Mailtrap status",
          providerStatus: response.status,
        },
        { status: 503 }
      );
    }

    const data = await response.json();

    const providerState = data?.page?.state;

    const status =
      providerState === "operational"
        ? "operational"
        : providerState === "degraded"
          ? "degraded"
          : providerState === "down"
            ? "down"
            : "unknown";

    return NextResponse.json({
      success: status === "operational",
      service: "mail",
      provider: "mailtrap",
      status,
      providerStatus: data?.page?.state_text,
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const latency = Date.now() - startedAt;

    console.error("[MAIL] Status check failed:", error);

    return NextResponse.json(
      {
        success: false,
        service: "mail",
        provider: "mailtrap",
        status: "unknown",
        latency,
        error: "Unable to reach Mailtrap status service",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}