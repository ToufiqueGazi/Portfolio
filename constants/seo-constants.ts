import { HERO_LOCATION, HERO_NAME, HERO_ROLE } from "./hero-constants";
import { CONTACT_EMAIL, MY_SOCIALS } from "./social-constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toufiquegazi.github.io"
).replace(/\/$/, "");

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = `${HERO_NAME} | ${HERO_ROLE}`;

export const SITE_TITLE = `${HERO_NAME} | Academic Portfolio & Research`;

export const SITE_DESCRIPTION =
  "Official academic portfolio of Toufique Ahammad Gazi, Assistant Professor in Computer Science & Engineering at Adamas University. Research in Cybersecurity, Cloud & IoT Networks, and Computer Vision.";

export const SITE_TAGLINE =
  "Assistant Professor in Computer Science & Engineering · Cybersecurity, IoT & Computer Vision Researcher.";

export const OG_IMAGE = "/og.jpg";
export const OG_IMAGE_ALT = `${HERO_NAME}, ${HERO_ROLE} academic portfolio`;
export const OG_LOCALE = "en_US";

export const OG_IMAGES = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: OG_IMAGE_ALT,
  },
];

export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const SITE_KEYWORDS = [
  HERO_NAME,
  "Toufique Gazi",
  "Assistant Professor",
  "Adamas University",
  "Computer Science & Engineering",
  "Cybersecurity Researcher",
  "Threat Intelligence",
  "Exploit Kits",
  "Cyber Kill Chain",
  "Cloud & IoT Security",
  "Computer Vision",
  "Sports Analytics",
  "Academic Portfolio",
  "Kolkata",
  "India",
];

export const HOME_TITLE = `${HERO_NAME} | Assistant Professor, CSE · Adamas University`;

export const HOME_DESCRIPTION =
  "Official academic portfolio of Toufique Ahammad Gazi, Assistant Professor in Computer Science & Engineering at Adamas University, Kolkata. Research in Cybersecurity, IoT Networks, and AI.";

export const SITE_SECTIONS = [
  {
    name: "Home",
    hash: "#home",
    description: `${HERO_NAME}, ${HERO_ROLE} at Adamas University.`,
  },
  {
    name: "About",
    hash: "#about",
    description: `Academic background, qualifications, and biography of ${HERO_NAME}.`,
  },
  {
    name: "Research",
    hash: "#research",
    description:
      "Research focus areas including Threat Intelligence, Cloud/IoT Security, and Computer Vision.",
  },
  {
    name: "Publications",
    hash: "#publications",
    description:
      "Peer-reviewed journal articles, book chapters, and conference presentations.",
  },
  {
    name: "Experience",
    hash: "#experience",
    description:
      "Academic teaching appointments, pedagogical contributions, and institutional responsibilities.",
  },
  {
    name: "Projects",
    hash: "#projects",
    description:
      "Research implementations, experimental testbeds, and academic prototypes.",
  },
  {
    name: "Contact",
    hash: "#contact",
    description: `Academic contact, institutional address, and scholarly profiles.`,
  },
] as const;

export const SOCIAL_PROFILES = MY_SOCIALS.map((social) => social.href);

export const CONTACT_POINT_EMAIL = CONTACT_EMAIL;
