import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "CWT",
  description: "Calendar With Tasks",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CWT",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
