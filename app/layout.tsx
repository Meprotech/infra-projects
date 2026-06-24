import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AOSInit } from "@/components/AOSInit";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Editorial serif used for italic accent words inside headings (CW-style).
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Infrastructure Construction`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: SITE.logo.mark,
    apple: SITE.logo.mark,
  },
  metadataBase: new URL("https://example.com"), // TODO: set production URL
  openGraph: {
    title: `${SITE.name} — Infrastructure Construction`,
    description: SITE.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${serif.variable}`}
    >
      <body className="min-h-screen bg-concrete-950 font-sans">
        <MotionProvider>
          <AOSInit />
          <SmoothScroll />
          <ScrollProgressBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
