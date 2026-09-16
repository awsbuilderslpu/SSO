"use client";

import { useState } from "react";

const requestExample = `{
  "to": "student@example.com",
  "subject": "Application Update",
  "greeting": "Dear Student,",
  "heading": "Application Update",
  "content": "Your application has been shortlisted.\\n\\nFurther details will be shared shortly.",
  "senderName": "AWS Student Builder Group",
  "senderRole": "Recruitment Team"
}`;

const curlExample = `curl -X POST https://sso.awslpu.in/api/v1/mail/send \\
  -H "Authorization: Bearer YOUR_MAIL_AUTH_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${requestExample.replace(/\n/g, "")}'`;

const jsExample = `const response = await fetch(
  "https://sso.awslpu.in/api/v1/mail/send",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.MAIL_AUTH_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(${requestExample})
  }
);

const data = await response.json();`;

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button
      onClick={copy}
      className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#080d16]">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {language || "code"}
        </span>

        <CopyButton value={code} />
      </div>

      <pre className="overflow-x-auto p-5 text-[13px] leading-6 text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MailDocsPage() {
  const [example, setExample] = useState<"curl" | "javascript">("curl");

  return (
    <main className="min-h-screen bg-[#070c14] text-slate-200">
      <div className="border-b border-slate-800/80 bg-[#080e18]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="https://awslpu.in/image/logo/aws_student_builder_group.png"
              alt="AWS Student Builder Group"
              className="h-8 w-8"
            />

            <div className="hidden h-5 w-px bg-slate-700 sm:block" />

            <span className="text-sm font-medium text-slate-200">
              Mail API
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              v1
            </span>
          </div>

          <a
            href="https://awslpu.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 transition hover:text-[#65e3d8]"
          >
            AWS LPU ↗
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-800/80 lg:block">
          <nav className="sticky top-0 px-6 py-10">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Documentation
            </p>

            <div className="space-y-1">
              {[
                ["#overview", "Overview"],
                ["#authentication", "Authentication"],
                ["#send", "Send email"],
                ["#request", "Request"],
                ["#response", "Response"],
                ["#examples", "Examples"],
              ].map(([href, label], index) => (
                <a
                  key={href}
                  href={href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    index === 0
                      ? "bg-slate-800/60 text-white"
                      : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-10 rounded-lg border border-slate-800 bg-[#0b111c] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#55dfd2]" />
                <span className="text-xs font-medium text-slate-300">
                  API status
                </span>
              </div>

              <p className="text-[11px] leading-5 text-slate-600">
                Centralized email delivery for AWS LPU projects.
              </p>
            </div>
          </nav>
        </aside>

        <article className="min-w-0 px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <section id="overview" className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
              <span>Mail API</span>
              <span>/</span>
              <span className="text-slate-300">Documentation</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Send email without managing email infrastructure.
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-400">
              Use the AWS LPU Mail API to send transactional emails from
              your project through a shared, standardized email service.
            </p>

            <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-[#0c131f]">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="w-fit rounded-md bg-[#55dfd2]/10 px-2.5 py-1 text-xs font-semibold text-[#55dfd2]">
                  POST
                </span>

                <code className="overflow-x-auto text-sm text-slate-300">
                  https://sso.awslpu.in/api/v1/mail/send
                </code>

                <div className="sm:ml-auto">
                  <CopyButton value="https://sso.awslpu.in/api/v1/mail/send" />
                </div>
              </div>
            </div>
          </section>

          <div className="my-16 h-px bg-slate-800/80" />

          <section id="authentication" className="max-w-3xl scroll-mt-10">
            <SectionHeader
              number="01"
              title="Authentication"
              description="Authenticate every request with the Mail API key assigned to your project."
            />

            <CodeBlock
              language="HTTP"
              code={`Authorization: Bearer YOUR_MAIL_AUTH_KEY
Content-Type: application/json`}
            />

            <div className="mt-5 rounded-xl border border-[#d7a1f9]/20 bg-[#d7a1f9]/5 p-4">
              <p className="text-sm font-medium text-[#d7a1f9]">
                Keep your key private
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Store the key in your server-side environment variables.
                Never expose it through client-side JavaScript or
                NEXT_PUBLIC_* variables.
              </p>
            </div>
          </section>

          <div className="my-16 h-px bg-slate-800/80" />

          <section id="send" className="max-w-3xl scroll-mt-10">
            <SectionHeader
              number="02"
              title="Send an email"
              description="Make a POST request to the endpoint with a JSON payload."
            />

            <CodeBlock
              language="HTTP"
              code={`POST /api/v1/mail/send
Host: sso.awslpu.in
Authorization: Bearer YOUR_MAIL_AUTH_KEY
Content-Type: application/json`}
            />
          </section>

          <div className="my-16 h-px bg-slate-800/80" />

          <section id="request" className="max-w-3xl scroll-mt-10">
            <SectionHeader
              number="03"
              title="Request"
              description="The API accepts a simple JSON payload. Content is plain text and supports multiple paragraphs."
            />

            <CodeBlock
              language="JSON"
              code={requestExample}
            />

            <div className="mt-8 overflow-hidden rounded-xl border border-slate-800">
              <div className="border-b border-slate-800 bg-[#0c131f] px-5 py-3">
                <span className="text-xs font-medium text-slate-400">
                  Parameters
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {[
                  ["to", "string", "required", "Recipient email address."],
                  ["subject", "string", "required", "Email subject."],
                  ["content", "string", "required", "Plain-text email content. Use a blank line between paragraphs."],
                  ["greeting", "string", "optional", "Greeting displayed above the message."],
                  ["heading", "string", "optional", "Main heading displayed in the email."],
                  ["senderName", "string", "optional", "Name displayed in the signature."],
                  ["senderRole", "string", "optional", "Role or team displayed below the sender name."],
                ].map(([name, type, required, description]) => (
                  <div
                    key={name}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[130px_90px_80px_1fr] sm:items-start"
                  >
                    <code className="text-sm text-[#65e3d8]">
                      {name}
                    </code>

                    <span className="text-xs text-slate-500">
                      {type}
                    </span>

                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        required === "required"
                          ? "text-[#d7a1f9]"
                          : "text-slate-600"
                      }`}
                    >
                      {required}
                    </span>

                    <span className="text-xs leading-5 text-slate-500">
                      {description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="my-16 h-px bg-slate-800/80" />

          <section id="response" className="max-w-3xl scroll-mt-10">
            <SectionHeader
              number="04"
              title="Response"
              description="A successful request returns a confirmation from the Mail API."
            />

            <CodeBlock
              language="JSON"
              code={`{
  "success": true,
  "message": "Email sent successfully"
}`}
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {[
                ["200", "Sent"],
                ["400", "Invalid request"],
                ["401", "Unauthorized"],
                ["500", "Server error"],
              ].map(([code, label]) => (
                <div
                  key={code}
                  className="rounded-lg border border-slate-800 bg-[#0c131f] p-4"
                >
                  <code className="text-sm font-semibold text-[#65e3d8]">
                    {code}
                  </code>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="my-16 h-px bg-slate-800/80" />

          <section id="examples" className="max-w-3xl scroll-mt-10">
            <SectionHeader
              number="05"
              title="Examples"
              description="Copy one of the examples below and start integrating."
            />

            <div className="mb-4 flex w-fit rounded-lg border border-slate-800 bg-[#0c131f] p-1">
              <button
                onClick={() => setExample("curl")}
                className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                  example === "curl"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                cURL
              </button>

              <button
                onClick={() => setExample("javascript")}
                className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                  example === "javascript"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                JavaScript
              </button>
            </div>

            <CodeBlock
              language={example === "curl" ? "BASH" : "JAVASCRIPT"}
              code={example === "curl" ? curlExample : jsExample}
            />
          </section>

          <div className="mt-20 border-t border-slate-800 pt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  AWS Student Builder Group
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Lovely Professional University
                </p>
              </div>

              <a
                href="https://awslpu.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#65e3d8] hover:underline"
              >
                awslpu.in ↗
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-[10px] font-medium text-[#55dfd2]">
          {number}
        </span>

        <span className="h-px w-8 bg-slate-700" />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}