"use client";

import { useEffect, useRef, useState } from "react";

export default function TestClientCallback() {
  const hasProcessed = useRef(false);

  const [status, setStatus] = useState(
    "Processing SSO login..."
  );

  const [error, setError] = useState("");

  const [user, setUser] = useState<{
    email?: string;
    name?: string;
    sub?: string;
    picture?: string;
  } | null>(null);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    async function handleCallback() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const code =
        params.get("code");

      const state =
        params.get("state");

      const savedState =
        sessionStorage.getItem(
          "sso_state"
        );

      const codeVerifier =
        sessionStorage.getItem(
          "sso_code_verifier"
        );

      const savedNonce =
        sessionStorage.getItem(
          "sso_nonce"
        );

      if (!code) {
        setError(
          "Missing authorization code."
        );
        return;
      }

      if (
        !state ||
        state !== savedState
      ) {
        setError(
          "Invalid state parameter."
        );
        return;
      }

      if (!codeVerifier) {
        setError(
          "Missing PKCE verifier."
        );
        return;
      }

      if (!savedNonce) {
        setError(
          "Missing OIDC nonce."
        );
        return;
      }

      try {
        setStatus(
          "Exchanging authorization code..."
        );

        const tokenResponse =
          await fetch(
            "/api/test-client/token",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                code,
                codeVerifier,
              }),
            }
          );

        const tokenData =
          await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(
            tokenData.error_description ||
              tokenData.error ||
              "Token exchange failed"
          );
        }

        const accessToken =
          tokenData.access_token;

        const idToken =
          tokenData.id_token;

        if (!accessToken) {
          throw new Error(
            "Access token was not returned."
          );
        }

        if (!idToken) {
          throw new Error(
            "ID token was not returned."
          );
        }

        setStatus(
          "Verifying OIDC identity..."
        );

        const idTokenResponse =
          await fetch(
            "/api/test-client/id-token",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                idToken,
                nonce: savedNonce,
              }),
            }
          );

        const verifiedIdentity =
          await idTokenResponse.json();

        if (
          !idTokenResponse.ok ||
          verifiedIdentity.valid !== true
        ) {
          throw new Error(
            verifiedIdentity.error ||
              "ID token verification failed"
          );
        }

        if (
          verifiedIdentity.sub !==
            undefined &&
          typeof verifiedIdentity.sub !==
            "string"
        ) {
          throw new Error(
            "Invalid identity subject."
          );
        }

        setStatus(
          "Loading account..."
        );

        const userResponse =
          await fetch(
            "/oauth/userinfo",
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },
            }
          );

        const userData =
          await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.error ||
              "Userinfo request failed"
          );
        }

        if (
          userData.sub !==
          verifiedIdentity.sub
        ) {
          throw new Error(
            "ID token and userinfo subjects do not match."
          );
        }

        sessionStorage.removeItem(
          "sso_code_verifier"
        );

        sessionStorage.removeItem(
          "sso_state"
        );

        sessionStorage.removeItem(
          "sso_nonce"
        );

        window.history.replaceState(
          {},
          document.title,
          "/test-client/callback"
        );

        window.location.replace(
          "/dashboard"
        );
      } catch (err) {
        console.error(
          "SSO callback error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      }
    }

    handleCallback();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1c1c1c 0%, #0b0b0b 45%, #050505 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          background:
            "rgba(20,20,20,0.96)",
          border:
            "1px solid #2d2d2d",
          borderRadius: "20px",
          padding: "48px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <img
            src="/aws_sbg.png"
            alt="AWS"
            style={{
              width: "100px",
              height: "auto",
            }}
          />

          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "#8c8c8c",
              textTransform: "uppercase",
            }}
          >
            OIDC TEST CLIENT
          </span>
        </div>

        {!error && !user && (
          <div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border:
                  "4px solid #303030",
                borderTopColor:
                  "#ff9900",
                animation:
                  "spin 1s linear infinite",
                marginBottom: "24px",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                color: "#ffffff",
              }}
            >
              {status}
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "#8f8f8f",
                lineHeight: 1.6,
              }}
            >
              Securely completing your
              authentication flow.
            </p>
          </div>
        )}

        {error && (
          <div>
            <div
              style={{
                display: "inline-flex",
                padding:
                  "8px 12px",
                borderRadius: "999px",
                background:
                  "rgba(220,38,38,0.12)",
                border:
                  "1px solid rgba(220,38,38,0.25)",
                color: "#ff6b6b",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing:
                  "0.12em",
                textTransform:
                  "uppercase",
              }}
            >
              Authentication failed
            </div>

            <h1
              style={{
                marginTop: "20px",
                marginBottom: "12px",
                fontSize: "30px",
                color: "#ffffff",
              }}
            >
              Unable to sign in
            </h1>

            <p
              style={{
                color: "#999999",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              {error}
            </p>

            <a
              href="/test-client"
              style={{
                display:
                  "inline-block",
                padding:
                  "13px 20px",
                borderRadius: "10px",
                background: "#ff9900",
                color: "#111111",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Return to test client
            </a>
          </div>
        )}

        {user && (
          <div>
            <div
              style={{
                display: "inline-flex",
                padding:
                  "8px 12px",
                borderRadius: "999px",
                background:
                  "rgba(34,197,94,0.1)",
                border:
                  "1px solid rgba(34,197,94,0.2)",
                color: "#5ee28a",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing:
                  "0.12em",
                textTransform:
                  "uppercase",
              }}
            >
              Authentication successful
            </div>

            <h1
              style={{
                marginTop: "20px",
                marginBottom: "8px",
                fontSize: "30px",
                color: "#ffffff",
              }}
            >
              Welcome back
            </h1>

            <p
              style={{
                color: "#999999",
                lineHeight: 1.6,
              }}
            >
              Your identity was verified
              through AWS LPU SSO.
            </p>

            <div
              style={{
                marginTop: "32px",
                border:
                  "1px solid #303030",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#151515",
              }}
            >
              {user.picture && (
                <div
                  style={{
                    padding: "24px",
                    borderBottom:
                      "1px solid #303030",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <img
                    src={user.picture}
                    alt=""
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius:
                        "50%",
                      objectFit:
                        "cover",
                      border:
                        "2px solid #333333",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#ffffff",
                        fontSize: "18px",
                      }}
                    >
                      {user.name ||
                        "SSO User"}
                    </div>

                    {user.email && (
                      <div
                        style={{
                          marginTop:
                            "4px",
                          color: "#8f8f8f",
                          fontSize:
                            "14px",
                        }}
                      >
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <InfoRow
                label="Subject"
                value={
                  user.sub || "—"
                }
              />

              <InfoRow
                label="Name"
                value={
                  user.name || "—"
                }
              />

              <InfoRow
                label="Email"
                value={
                  user.email || "—"
                }
              />
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "110px 1fr",
        gap: "20px",
        padding: "16px 20px",
        borderTop:
          "1px solid #2b2b2b",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing:
            "0.12em",
          color: "#777777",
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "14px",
          color: "#dddddd",
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}