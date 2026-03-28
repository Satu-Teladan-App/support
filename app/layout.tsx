import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Updated fonts
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satu Teladan Portal",
  description: "Support & Forum Portal Satu Teladan",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

import { AuthProvider } from "@/providers/auth-provider";
import { GlobalLayout } from "@/components/GlobalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${interFont.variable} ${outfitFont.variable} antialiased font-sans`}>
        <AuthProvider>
          <GlobalLayout>
            {children}
          </GlobalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
