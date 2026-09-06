import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sso.awslpu.in"),

  title: {
    default: "AWS LPU SSO",
    template: "%s | AWS LPU SSO",
  },

  description:
    "One Identity. Every Application. Secure authentication for AWS LPU applications.",

  applicationName: "AWS LPU SSO",

  keywords: [
    "AWS LPU",
    "AWS LPU SSO",
    "Single Sign-On",
    "SSO",
    "OAuth 2.0",
    "OpenID Connect",
    "OIDC",
    "Identity Platform",
    "Identity Services",
  ],

  authors: [
    {
      name: "AWS LPU",
    },
  ],

  creator: "AWS LPU",

  publisher: "AWS LPU",

  icons: {
    icon: [
      {
        url: "/aws_sbg.png",
        type: "image/png",
      },
    ],

    shortcut: "/aws_sbg.png",

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "AWS LPU SSO",

    description:
      "One Identity. Every Application. Secure authentication for AWS LPU applications.",

    url: "https://sso.awslpu.in",

    siteName: "AWS LPU SSO",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AWS LPU Identity Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "AWS LPU SSO",

    description:
      "One Identity. Every Application. Secure authentication for AWS LPU applications.",

    images: [
      "/og-image.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] text-white">
        {children}
      </body>
    </html>
  );
}