import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  applicationName: "Verbum",
  title: {
    default: "Verbum",
    template: "%s | Verbum",
  },
  description: "Learn Biblical vocabulary — Polish ↔ English",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Verbum",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aad",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body className="bg-verbum-950 text-white antialiased overflow-hidden">
        <main className="h-[100dvh] overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
