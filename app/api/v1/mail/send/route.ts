import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { render } from "react-email";
import { MailtrapClient } from "mailtrap";

import GeneralEmail from "@/emails/GeneralEmail";

export const runtime = "nodejs";

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const authKey = authHeader.slice(7);

    if (!process.env.MAIL_AUTH_KEY) {
      console.error("[MAIL] MAIL_AUTH_KEY is not configured");

      return NextResponse.json(
        {
          success: false,
          error: "Mail API is not configured",
        },
        { status: 500 }
      );
    }

    if (authKey !== process.env.MAIL_AUTH_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      to,
      subject,
      content,
      greeting,
      heading,
      senderName,
      senderRole,
    } = body;

    if (!to || !subject || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "to, subject and content are required",
        },
        { status: 400 }
      );
    }

    const email = React.createElement(GeneralEmail, {
      subject,
      greeting,
      heading,
      content: React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: content,
        },
      }),
      senderName,
      senderRole,
    });

    const html = await render(email);

    const result = await mailtrap.send({
      from: {
        email: process.env.MAIL_FROM_EMAIL!,
        name:
          process.env.MAIL_FROM_NAME ||
          "AWS Student Builder Group",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      html,
    });

    console.log("[MAIL] Email sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("[MAIL] Failed to send email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
      },
      { status: 500 }
    );
  }
}