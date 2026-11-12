import { type Metadata } from "next";
import { HomePage } from "@/components/portfolio/home-page";
import { loadAllContent } from "@/lib/content-service";
import {
  OG_IMAGES,
  OG_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/constants/seo-constants";

export async function generateMetadata(): Promise<Metadata> {
  const content = loadAllContent();
  const title = `${content.home.name} · ${content.home.role}`;
  const description = content.home.tagline;
  const nameParts = content.home.name.split(" ");
  const firstName = nameParts[0] || "Toufique";
  const lastName = nameParts.slice(1).join(" ") || "Ahammad Gazi";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: "/",
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
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALE,
      images: OG_IMAGES,
      firstName,
      lastName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: OG_IMAGES,
    },
  };
}

export default function Home() {
  const content = loadAllContent();
  return <HomePage content={content} />;
}
