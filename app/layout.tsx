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
    "AWS LPU Identity Services — secure OpenID Connect authentication.",
  applicationName: "AWS LPU SSO",
  keywords: [
    "AWS LPU",
    "SSO",
    "Single Sign-On",
    "OpenID Connect",
    "OAuth 2.0",
    "Identity Services",
  ],
  icons: {
    icon: "/aws_sbg.png",
    shortcut: "/aws_sbg.png",
    apple: "/aws_sbg.png",
  },
  openGraph: {
    title: "AWS LPU SSO",
    description:
      "AWS LPU Identity Services — secure OpenID Connect authentication.",
    url: "https://sso.awslpu.in",
    siteName: "AWS LPU SSO",
    type: "website",
    images: [
      {
        url: "/aws_sbg.png",
        alt: "AWS LPU",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "AWS LPU SSO",
    description:
      "AWS LPU Identity Services — secure OpenID Connect authentication.",
    images: ["/aws_sbg.png"],
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