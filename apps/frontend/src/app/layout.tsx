import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/providers/AuthInitializer";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets:  ["latin"],
  variable: "--font-space",
});

// ── SEO METADATA ───────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "AdminHub — Full-Stack Task Management Platform",
    template: "%s | AdminHub",
  },
  description:
    "AdminHub is a production-ready full-stack task management platform built with Next.js, Express, and MongoDB. Manage tasks, track progress, and collaborate with your team.",
  keywords: [
    "task management",
    "project management",
    "dashboard",
    "admin panel",
    "Next.js",
    "Express",
    "MongoDB",
    "full-stack",
    "productivity",
  ],
  authors:  [{ name: "Adeoluwa Adeoye", url: "https://adeoluwaadeoye.netlify.app" }],
  creator:  "Adeoluwa Adeoye",
  metadataBase: new URL("https://adminhub-sigma.vercel.app"),

  // ── OPEN GRAPH ─────────────────────────────────────────
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://adminhub-sigma.vercel.app",
    siteName:    "AdminHub",
    title:       "AdminHub — Full-Stack Task Management Platform",
    description: "Manage tasks, track progress, and ship faster with AdminHub — a production-ready full-stack platform.",
    images: [
      {
        url:    "/bg.jpg",
        width:  1200,
        height: 630,
        alt:    "AdminHub Dashboard Preview",
      },
    ],
  },

  // ── TWITTER CARD ───────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       "AdminHub — Full-Stack Task Management Platform",
    description: "Manage tasks, track progress, and ship faster with AdminHub.",
    images:      ["/bg.png"],
    creator:     "@AdeDadB",
  },

  // ── ICONS ──────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/admin.png",    sizes: "any"     },
      { url: "/admin.png",    sizes: "16x16",  type: "image/png" },
      { url: "/admin.png",    sizes: "32x32",  type: "image/png" },
      { url: "/admin.png",   sizes: "192x192",type: "image/png" },
    ],
    apple:   [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/admin.png",
  },

  // ── MANIFEST ───────────────────────────────────────────
  manifest: "/manifest.json",

  // ── ROBOTS ─────────────────────────────────────────────
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ── CANONICAL ──────────────────────────────────────────
  alternates: {
    canonical: "https://adminhub-sigma.vercel.app",
  },
};

// ── VIEWPORT ───────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a"  },
  ],
  width:        "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ── EXTRA META TAGS ──────────────────────────── */}
        <meta name="application-name"    content="AdminHub" />
        <meta name="apple-mobile-web-app-capable"          content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title"            content="AdminHub" />
        <meta name="format-detection"    content="telephone=no" />
        <meta name="mobile-web-app-capable"                content="yes" />
        <meta name="msapplication-TileColor"               content="#4f46e5" />
        <meta name="msapplication-tap-highlight"           content="no" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased bg-gray-50 dark:bg-background`}
      >
        <ThemeProvider>
          <AuthInitializer />

          <div className="flex flex-col">
            <Header />

            {/* pt-24 clears the fixed header */}
            <main className="flex-1 pt-24">
              {children}
            </main>

            <Footer />

            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={false}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}