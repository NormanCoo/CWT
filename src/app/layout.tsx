import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CP-CTM",
  description: "Cross-Platform Calendar Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
