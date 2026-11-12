/**
 * Content Loader & Runtime Markdown Fetcher for Toufique Ahammad Gazi Portfolio.
 * Provides caching, error handling, offline fallbacks, and live fetching from public/content or GitHub raw.
 */

export interface ProfileData {
  name: string;
  title: string;
  department: string;
  institution: string;
  location: string;
  email: string;
  alternateEmail?: string;
  avatar: string;
  status: string;
  resumeUrl: string;
  bioShort: string;
  tagline: string;
  stats: { label: string; value: string }[];
  bioFull: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string[];
}

export interface ExperienceItem {
  role: string;
  institution: string;
  department: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface ResearchArea {
  id: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  topics: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string;
  year: string;
  type: string;
  venue: string;
  badge: string;
  abstract: string;
  doi?: string;
  url?: string;
  keywords?: string[];
}

export interface BookChapterItem {
  id: string;
  title: string;
  bookTitle: string;
  authors: string;
  publisher: string;
  year: string;
  isbn?: string;
  doi?: string;
  url?: string;
  abstract: string;
  keywords?: string[];
}

export interface ConferenceItem {
  id: string;
  title: string;
  conference: string;
  year: string;
  role: string;
  location: string;
  abstract: string;
  tags?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  status: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  description: string;
  techStack: string[];
  highlights: string[];
}

export interface PatentItem {
  id: string;
  title: string;
  status: string;
  applicationNumber?: string;
  filingDate?: string;
  jurisdiction: string;
  inventors: string[];
  abstract: string;
}

export interface CourseTaughtItem {
  code: string;
  name: string;
  level: string;
  institution: string;
  topics: string;
}

export interface AcademicActivityItem {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface LinkItem {
  name: string;
  label: string;
  category: string;
  url: string;
  description: string;
  icon: string;
}

/**
 * Lightweight browser-safe Frontmatter parser
 */
export function parseFrontmatter(rawText: string): { data: Record<string, unknown>; content: string } {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("---")) {
    return { data: {}, content: trimmed };
  }

  const endIdx = trimmed.indexOf("\n---", 3);
  if (endIdx === -1) {
    return { data: {}, content: trimmed };
  }

  const yamlBlock = trimmed.slice(4, endIdx);
  const content = trimmed.slice(endIdx + 4).trim();
  const data: Record<string, unknown> = {};

  const lines = yamlBlock.split("\n");
  let currentArray: unknown[] | null = null;
  let currentObject: Record<string, unknown> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    // Detect array item in current array
    if (rawLine.startsWith("  - ") || rawLine.startsWith("    - ")) {
      const itemText = line.replace(/^[-\s]+/, "").trim();
      if (itemText.includes(":") && !itemText.startsWith('"') && !itemText.startsWith("'")) {
        // Object item in array
        const [k, ...vParts] = itemText.split(":");
        const kTrim = k.trim();
        const vTrim = vParts.join(":").trim().replace(/^["']|["']$/g, "");
        if (!currentObject) {
          currentObject = {};
          if (currentArray) currentArray.push(currentObject);
        }
        currentObject[kTrim] = vTrim;
      } else {
        // String in array
        const val = itemText.replace(/^["']|["']$/g, "");
        if (currentArray) currentArray.push(val);
      }
      continue;
    }

    // Detect indented key: value belonging to currentObject in array
    if (rawLine.startsWith("      ") || (rawLine.startsWith("    ") && line.includes(":"))) {
      if (currentObject && line.includes(":")) {
        const [k, ...vParts] = line.split(":");
        currentObject[k.trim()] = vParts.join(":").trim().replace(/^["']|["']$/g, "");
        continue;
      }
    }

    currentObject = null;

    // Top-level key: value
    if (line.includes(":")) {
      const colonIdx = line.indexOf(":");
      const key = line.slice(0, colonIdx).trim();
      const valStr = line.slice(colonIdx + 1).trim();

      if (valStr === "") {
        currentArray = [];
        data[key] = currentArray;
      } else {
        currentArray = null;
        if (valStr.startsWith("[") && valStr.endsWith("]")) {
          // JSON-style array: ["a", "b"]
          try {
            data[key] = JSON.parse(valStr);
          } catch {
            data[key] = valStr.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
          }
        } else {
          data[key] = valStr.replace(/^["']|["']$/g, "");
        }
      }
    }
  }

  return { data, content };
}

/**
 * Fetch a markdown file with local storage caching and deployment base path support.
 */
export async function fetchMarkdownFile(fileName: string): Promise<{ data: Record<string, unknown>; content: string }> {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const localUrl = `${cleanBase}/content/${fileName}`;

  // Optional live GitHub raw fallback if provided in env
  const githubRawUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_RAW_URL
    ? `${process.env.NEXT_PUBLIC_GITHUB_REPO_RAW_URL}/content/${fileName}`
    : null;

  const cacheKey = `academic_content_${fileName}`;
  const cacheTimeKey = `academic_content_time_${fileName}`;
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // Check cache first (only in browser)
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      if (cached && cacheTime && Date.now() - parseInt(cacheTime, 10) < CACHE_TTL_MS) {
        return parseFrontmatter(cached);
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  // Fetch from local static content first, fallback to GitHub raw
  const urlsToTry = [localUrl];
  if (githubRawUrl) urlsToTry.unshift(githubRawUrl);

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, text);
            localStorage.setItem(cacheTimeKey, Date.now().toString());
          } catch {
            // Ignore storage quota
          }
        }
        return parseFrontmatter(text);
      }
    } catch {
      // Continue to next URL
    }
  }

  throw new Error(`Failed to load ${fileName}`);
}
