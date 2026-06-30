import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE_KEYWORDS, SITE_URL, absoluteUrl } from "@/lib/seo";

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
    default: `${SITE.name} - Infrastructure Construction`,
    template: `%s - ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Infrastructure Construction",
  keywords: SITE_KEYWORDS,
  icons: {
    icon: SITE.logo.mark,
    apple: SITE.logo.mark,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE.name} - Infrastructure Construction`,
    description: SITE.description,
    url: absoluteUrl("/"),
    siteName: SITE.name,
    images: [
      {
        url: absoluteUrl("/hero-treatment-plant.webp"),
        alt: `${SITE.name} water infrastructure project`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - Infrastructure Construction`,
    description: SITE.description,
    images: [absoluteUrl("/hero-treatment-plant.webp")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
    logo: absoluteUrl(SITE.logo.full),
    foundingDate: SITE.foundingYear,
    email: SITE.contact.email,
    description: SITE.description,
    address: SITE.contact.addresses.map((address) => ({
      "@type": "PostalAddress",
      name: address.label,
      streetAddress: address.value,
      addressCountry: "IN",
    })),
    areaServed: "India",
    knowsAbout: [
      "Water supply infrastructure",
      "Sewerage and drainage",
      "Water treatment plants",
      "Pipeline transmission networks",
      "Irrigation infrastructure",
      "Environmental infrastructure",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
  };

  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${serif.variable}`}
    >
      <body className="min-h-screen bg-concrete-950 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        <MotionProvider>
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
