import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail API Documentation",
  description:
    "Documentation for the AWS LPU centralized Mail API. Integrate transactional email into your project using a simple REST API.",
  applicationName: "AWS LPU Mail API",
  keywords: [
    "AWS LPU",
    "Mail API",
    "AWS Student Builder Group",
    "email API",
    "transactional email",
    "REST API",
  ],
  authors: [
    {
      name: "AWS Student Builder Group",
      url: "https://awslpu.in",
    },
  ],
  creator: "AWS Student Builder Group",
  publisher: "AWS Student Builder Group",
  metadataBase: new URL("https://sso.awslpu.in"),
  alternates: {
    canonical: "/mail/docs",
  },
  openGraph: {
    title: "Mail API Documentation",
    description:
      "Integrate transactional email into your AWS LPU project using the centralized Mail API.",
    url: "https://sso.awslpu.in/mail/docs",
    siteName: "AWS LPU",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Mail API Documentation",
    description:
      "Documentation for the AWS LPU centralized Mail API.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MailDocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}