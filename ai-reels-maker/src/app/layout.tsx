import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Reels Maker | Viral Short Video Generator",
  description:
    "AI Reels Maker helps creators generate viral-ready short videos with AI voiceovers, smart visuals, and instant downloads for YouTube Shorts, Instagram Reels, and TikTok.",
  openGraph: {
    title: "AI Reels Maker",
    description:
      "Build viral short videos from a script in seconds. Futuristic AI workflows with live preview, trending templates, voiceovers, and music.",
    url: "https://agentic-cdd0e350.vercel.app",
    siteName: "AI Reels Maker",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "AI Reels Maker preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Reels Maker",
    description:
      "Generate viral short videos for Reels, Shorts, and TikTok with AI voice, visuals, and music.",
  },
  keywords: [
    "AI video generator",
    "short video maker",
    "YouTube Shorts AI",
    "Instagram Reels automation",
    "TikTok content AI",
  ],
  metadataBase: new URL("https://agentic-cdd0e350.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15),_transparent_65%)]`}
      >
        <ThemeProvider>
          <div className="relative min-h-screen bg-transparent">
            <div className="pointer-events-none fixed inset-0 bg-grid-fade opacity-80" />
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
