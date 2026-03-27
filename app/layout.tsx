import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailForge — Email Template Builder",
  description:
    "Build responsive HTML email templates for Gmail, Outlook, and mobile. No code required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
