import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  try {
    if (!process.env.MAILTRAP_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          service: "mail",
          provider: "mailtrap",
          status: "unconfigured",
          error: "MAILTRAP_API_KEY is not configured",
        },
        { status: 503 }
      );
    }

    const response = await fetch(
      "https://send.api.mailtrap.io/api/accounts",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MAILTRAP_API_KEY}`,
          Accept: "application/json",
        },
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
          status: "degraded",
          latency,
          error: "Mailtrap service check failed",
          providerStatus: response.status,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      service: "mail",
      provider: "mailtrap",
      status: "operational",
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
        status: "down",
        latency,
        error: "Unable to reach Mailtrap",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}