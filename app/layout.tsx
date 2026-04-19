import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalaiindia.com"),
  title: {
    default: "DigitalAIIndia | India's AI Platform for Chat, Voice, Design and 3D",
    template: "%s | DigitalAIIndia",
  },
  description:
    "Build production-ready AI products with one India-first platform for chat, voice, design, 3D workflows, secure API keys, and developer tooling.",
  keywords: [
    "DigitalAIIndia",
    "AI platform India",
    "AI APIs",
    "voice AI India",
    "design AI",
    "3D AI",
    "developer platform",
  ],
  openGraph: {
    title: "DigitalAIIndia | India's AI Platform for Chat, Voice, Design and 3D",
    description:
      "One platform to launch AI products faster with unified APIs, developer dashboards, and India-first pricing.",
    url: "https://digitalaiindia.com",
    siteName: "DigitalAIIndia",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "DigitalAIIndia platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalAIIndia | India's AI Platform",
    description:
      "Ship AI apps faster with unified APIs for chat, voice, design and 3D.",
    images: ["/banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Apply stored theme immediately to prevent flash of wrong theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
