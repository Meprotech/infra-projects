import type { Metadata } from "next";
import { SITE } from "@/data/site";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalathiya-infra.vercel.app";

export const SITE_KEYWORDS = [
  "Kalathiya Infrastructure",
  "infrastructure construction India",
  "water supply projects",
  "sewerage drainage contractor",
  "water treatment plant construction",
  "pipeline transmission networks",
  "irrigation infrastructure",
  "environmental infrastructure",
  "Gujarat infrastructure contractor",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  images = ["/hero-treatment-plant.webp"],
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} - ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      images: images.map((image) => ({
        url: absoluteUrl(image),
        alt: SITE.name,
      })),
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE.name}`,
      description,
      images: images.map((image) => absoluteUrl(image)),
    },
  };
}
