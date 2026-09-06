import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Integrate your application with AWS LPU Identity Services.",
  openGraph: {
    title: "AWS LPU SSO Documentation",
    description:
      "Integrate your application with AWS LPU Identity Services.",
    url: "https://sso.awslpu.in/docs",
    siteName: "AWS LPU SSO",
    type: "website",
    images: [
      {
        url: "/docs-og-image.png",
        width: 1200,
        height: 630,
        alt: "DOCS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS LPU SSO Documentation",
    description:
      "Integrate your application with AWS LPU Identity Services.",
    images: ["/docs-og-image.png"],
  },
};

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CodeBlock({
  children,
}: {
  children: string;
}) {
  return (
    <div className="relative mt-6 overflow-hidden border border-white/9 bg-black/30">
      <div className="flex items-center justify-between border-b border-white/7 px-4 py-3">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Example
        </span>

        <span className="text-zinc-600">
          <CopyIcon />
        </span>
      </div>

      <pre className="overflow-x-auto p-5 text-sm leading-7 text-zinc-400">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Endpoint({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  return (
    <div className="border border-white/8 bg-white/2 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="border border-orange-400/30 bg-orange-400/6 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-orange-400">
          {method}
        </span>

        <code className="text-sm text-zinc-200">
          {path}
        </code>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function Step({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-white/8 py-10 last:border-b-0"
    >
      <div className="flex gap-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-orange-400/30 text-[10px] font-bold text-orange-400">
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {title}
          </h2>

          <div className="mt-5">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DocsPage() {
  const issuer = "https://sso.awslpu.in";

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[20%] -top-75 h-150 w-200 rounded-full bg-orange-500/5 blur-[180px]" />

        <div className="absolute inset-0 opacity-2 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#08090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-19 max-w-375 items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-5"
          >
            <img
              src="/aws_sbg.png"
              alt="AWS LPU"
              className="h-11 w-auto object-contain"
            />

            <div className="h-8 w-px bg-white/12" />

            <div>
              <p className="text-sm font-semibold tracking-wide text-zinc-200">
                AWS LPU
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                Identity Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-200 sm:block"
            >
              Overview
            </Link>

            <Link
              href="/login"
              className="border border-white/14 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 transition hover:border-orange-400/50 hover:text-orange-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-375 grid-cols-1 border-x border-white/6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/8 lg:block">
          <div className="sticky top-19 p-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
              Documentation
            </p>

            <nav className="mt-5 space-y-1">
              <a
                href="#overview"
                className="block border-l-2 border-orange-400 bg-orange-400/4 px-4 py-3 text-xs font-medium text-zinc-200"
              >
                Overview
              </a>

              <a
                href="#quick-start"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Quick Start
              </a>

              <a
                href="#register"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Register Application
              </a>

              <a
                href="#login"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Start Login
              </a>

              <a
                href="#callback"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Handle Callback
              </a>

              <a
                href="#token"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Exchange Token
              </a>

              <a
                href="#userinfo"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                User Information
              </a>

              <a
                href="#endpoints"
                className="block border-l-2 border-transparent px-4 py-3 text-xs text-zinc-500 transition hover:text-zinc-200"
              >
                Endpoints
              </a>
            </nav>

            <div className="mt-10 border border-white/8 bg-white/2 p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                Need Access?
              </p>

              <p className="mt-3 text-xs leading-5 text-zinc-500">
                Register your application from the AWS LPU SSO admin panel.
              </p>

              <Link
                href="/login"
                className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-300 transition hover:text-orange-300"
              >
                Sign In →
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <section
            id="overview"
            className="border-b border-white/8 px-6 py-14 lg:px-14 lg:py-16"
          >
            <div className="flex items-center gap-3">
              <div className="h-7 w-0.75 bg-orange-400" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-400">
                Developer Documentation
              </p>
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.04em] text-zinc-100 sm:text-5xl">
              Integrate with AWS LPU SSO.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500">
              Connect your application to AWS LPU Identity Services and let
              users sign in using one AWS LPU account.
            </p>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              <div className="border border-white/8 bg-white/2 p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Protocol
                </p>

                <p className="mt-3 text-sm font-medium text-zinc-200">
                  OAuth 2.0 + OIDC
                </p>
              </div>

              <div className="border border-white/8 bg-white/2 p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Authorization
                </p>

                <p className="mt-3 text-sm font-medium text-zinc-200">
                  Authorization Code + PKCE
                </p>
              </div>

              <div className="border border-white/8 bg-white/2 p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Identity
                </p>

                <p className="mt-3 text-sm font-medium text-zinc-200">
                  OpenID Connect
                </p>
              </div>
            </div>
          </section>

          <div className="px-6 lg:px-14">
            <section
              id="quick-start"
              className="scroll-mt-24 border-b border-white/8 py-12"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400">
                Quick Start
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-zinc-100">
                Your application only needs to do four things.
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["01", "Register your application"],
                  ["02", "Send users to AWS LPU SSO"],
                  ["03", "Receive the login response"],
                  ["04", "Exchange the code for user identity"],
                ].map(([number, title]) => (
                  <div
                    key={number}
                    className="flex items-center gap-5 border border-white/8 bg-white/2 p-5"
                  >
                    <span className="text-[10px] font-bold text-orange-400">
                      {number}
                    </span>

                    <span className="text-sm text-zinc-300">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <Step
              id="register"
              number="01"
              title="Register your application"
            >
              <p className="max-w-2xl text-sm leading-7 text-zinc-500">
                Sign in to the AWS LPU SSO admin panel and open the application
                management page. Register your application and add the exact
                URL where users should return after signing in.
              </p>

              <div className="mt-6 border border-white/8 bg-white/2 p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Example
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-32 text-zinc-600">
                      Application
                    </span>

                    <span className="text-zinc-300">
                      AWS LPU Mock Exams
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-32 text-zinc-600">
                      Client ID
                    </span>

                    <span className="font-mono text-zinc-300">
                      sso_xxxxxxxxxxxxxxxxx
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-32 text-zinc-600">
                      Redirect URL
                    </span>

                    <span className="font-mono text-zinc-300">
                      https://yourapp.com/auth/callback
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-zinc-500">
                Keep your client secret on your server. Never expose it in
                frontend code.
              </p>
            </Step>

            <Step
              id="login"
              number="02"
              title="Send the user to AWS LPU SSO"
            >
              <p className="text-sm leading-7 text-zinc-500">
                When the user clicks your sign-in button, redirect them to the
                authorization endpoint with your application details.
              </p>

              <CodeBlock>{`${issuer}/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=openid%20profile%20email&state=YOUR_STATE&nonce=YOUR_NONCE&code_challenge=YOUR_CHALLENGE&code_challenge_method=S256`}</CodeBlock>

              <div className="mt-7 grid gap-3 md:grid-cols-2">
                <div className="border border-white/8 p-5">
                  <p className="text-sm font-medium text-zinc-300">
                    client_id
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-600">
                    The Client ID generated when you registered your
                    application.
                  </p>
                </div>

                <div className="border border-white/8 p-5">
                  <p className="text-sm font-medium text-zinc-300">
                    redirect_uri
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-600">
                    Must exactly match a redirect URL registered for your app.
                  </p>
                </div>

                <div className="border border-white/8 p-5">
                  <p className="text-sm font-medium text-zinc-300">
                    state
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-600">
                    A random value you create before login and verify after the
                    user returns.
                  </p>
                </div>

                <div className="border border-white/8 p-5">
                  <p className="text-sm font-medium text-zinc-300">
                    nonce + PKCE
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-600">
                    Random security values generated before sending the user to
                    sign in.
                  </p>
                </div>
              </div>
            </Step>

            <Step
              id="callback"
              number="03"
              title="Handle the callback"
            >
              <p className="text-sm leading-7 text-zinc-500">
                After the user signs in, AWS LPU SSO redirects them back to
                your registered redirect URL.
              </p>

              <CodeBlock>{`https://yourapp.com/auth/callback?code=AUTHORIZATION_CODE&state=YOUR_STATE`}</CodeBlock>

              <p className="mt-6 text-sm leading-7 text-zinc-500">
                First verify that the returned state matches the value you
                created before login. Then use the authorization code to get
                the user&apos;s identity.
              </p>
            </Step>

            <Step
              id="token"
              number="04"
              title="Exchange the authorization code"
            >
              <p className="text-sm leading-7 text-zinc-500">
                Send the authorization code to the token endpoint from your
                server. Do not expose your client secret in the browser.
              </p>

              <CodeBlock>{`POST ${issuer}/oauth/token

Authorization: Basic BASE64(CLIENT_ID:CLIENT_SECRET)
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTHORIZATION_CODE
&redirect_uri=YOUR_REDIRECT_URI
&code_verifier=YOUR_CODE_VERIFIER`}</CodeBlock>

              <p className="mt-6 text-sm leading-7 text-zinc-500">
                The response contains an access token and, when you request
                the <code className="text-zinc-300">openid</code> scope, an ID
                token.
              </p>

              <CodeBlock>{`{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "openid profile email",
  "id_token": "..."
}`}</CodeBlock>
            </Step>

            <section
              id="userinfo"
              className="scroll-mt-24 border-b border-white/8 py-10"
            >
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-orange-400/30 text-[10px] font-bold text-orange-400">
                  05
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Get user information
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-zinc-500">
                    Use the access token to get the authenticated user&apos;s
                    information.
                  </p>

                  <CodeBlock>{`GET ${issuer}/oauth/userinfo
                  Authorization: Bearer ACCESS_TOKEN`}</CodeBlock>

                  <p className="mt-6 text-sm leading-7 text-zinc-500">
                    Depending on the scopes requested, the user information can
                    include their identity, name, email, and profile picture.
                  </p>

                  <CodeBlock>{`{
  "sub": "user-id",
  "name": "User Name",
  "email": "user@example.com",
  "picture": "https://..."
}`}</CodeBlock>
                </div>
              </div>
            </section>

            <section
              id="endpoints"
              className="scroll-mt-24 py-12"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400">
                Reference
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-zinc-100">
                AWS LPU SSO endpoints
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Use these endpoints when integrating your application with AWS
                LPU Identity Services.
              </p>

              <div className="mt-8 grid gap-3">
                <Endpoint
                  method="GET"
                  path={`${issuer}/authorize`}
                  description="Starts the user sign-in and authorization process."
                />

                <Endpoint
                  method="POST"
                  path={`${issuer}/oauth/token`}
                  description="Exchanges an authorization code for access and identity tokens."
                />

                <Endpoint
                  method="GET"
                  path={`${issuer}/oauth/userinfo`}
                  description="Returns information about the authenticated user."
                />

                <Endpoint
                  method="GET"
                  path={`${issuer}/oauth/jwks`}
                  description="Provides public keys used to verify ID tokens."
                />

                <Endpoint
                  method="GET"
                  path={`${issuer}/.well-known/openid-configuration`}
                  description="Provides the complete OpenID Connect configuration."
                />
              </div>
            </section>
          </div>

          <footer className="border-t border-white/8 px-6 py-8 lg:px-14">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold text-zinc-300">
                  AWS LPU Identity Platform
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  Secure identity for connected applications
                </p>
              </div>

              <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                © 2026 AWS LPU
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}