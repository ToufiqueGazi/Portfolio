import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  type Stat,
  type Project,
  type Service,
  type Experience,
} from "@/types/portfolio-types";
import { SERVICES } from "@/constants/services-constants";
import { EXPERIENCES } from "@/constants/experience-constants";
import { MY_PROJECTS } from "@/constants/projects-constants";
import { SKILL_CHIPS } from "@/constants/skills-constants";
import {
  INITIAL_PUBLICATIONS,
  INITIAL_BOOK_CHAPTERS,
  INITIAL_CONFERENCES,
  INITIAL_PATENTS,
  INITIAL_COURSES,
  INITIAL_ACTIVITIES,
  INITIAL_LINKS,
  INITIAL_EDUCATION,
} from "@/lib/academic-data";

export interface NoteCard {
  id: string;
  title: string;
  url: string;
  linkText: string;
}

export interface HomeContent {
  name: string;
  role: string;
  location: string;
  headlinePrefix: string;
  headlineSuffix: string;
  tagline: string;
  flipWords: string[];
  stats: Stat[];
  actionButtons: { label: string; href: string; primary?: boolean }[];
  overview: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  institution: string;
  phdInstitution: string;
  stats: Stat[];
  actionButtons: { label: string; href: string; primary?: boolean }[];
  educationTitle: string;
  degrees: EducationItem[];
  skillsTitle: string;
  skillsEyebrow: string;
  skills: string[];
  bio: string;
}

export interface ResearchContent {
  eyebrow: string;
  title: string;
  hint?: string[];
  domains: Service[];
  summary: string;
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

export interface PublicationsContent {
  eyebrow: string;
  title: string;
  summary: string;
  publications: PublicationItem[];
  bookChapters: BookChapterItem[];
  conferences: ConferenceItem[];
  patents: PatentItem[];
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

export interface ExperienceContent {
  eyebrow: string;
  title: string;
  experiences: Experience[];
  coursesTitle: string;
  coursesTaught: CourseTaughtItem[];
  activitiesEyebrow?: string;
  activitiesSectionTitle?: string;
  activitiesTitle: string;
  activities: AcademicActivityItem[];
}

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  notice: string;
  projects: Project[];
}

export interface NotesContent {
  eyebrow: string;
  title: string;
  description?: string;
  cards: NoteCard[];
}

export interface SocialProfile {
  name: string;
  label: string;
  url: string;
  description: string;
  icon: string;
}

export interface ContactContent {
  email: string;
  alternateEmail?: string;
  department: string;
  school: string;
  institution: string;
  campusAddress: string;
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  formEyebrow?: string;
  formTitle?: string;
  profilesEyebrow?: string;
  socials: SocialProfile[];
}

export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
  research: ResearchContent;
  publications: PublicationsContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  notes: NotesContent;
  contact: ContactContent;
}

function parseMarkdownFile<T>(filePath: string): { frontmatter: T; body: string } {
  if (!fs.existsSync(filePath)) {
    return { frontmatter: {} as T, body: "" };
  }

  try {
    let fileContents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
    if (fileContents.startsWith("---")) {
      const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n([\s\S]*))?$/);
      if (match) {
        const rawYaml = match[1].trim();
        const body = (match[2] || "").trim();
        try {
          const parsed = (yaml.load(rawYaml) as T) || ({} as T);
          return { frontmatter: parsed, body };
        } catch (err) {
          console.warn(`[ContentService] YAML parse error in ${filePath}:`, err);
          return { frontmatter: {} as T, body };
        }
      }

      const secondDashIndex = fileContents.indexOf("---", 3);
      if (secondDashIndex !== -1) {
        const rawYaml = fileContents.slice(3, secondDashIndex).trim();
        const body = fileContents.slice(secondDashIndex + 3).trim();
        try {
          const parsed = (yaml.load(rawYaml) as T) || ({} as T);
          return { frontmatter: parsed, body };
        } catch (err) {
          console.warn(`[ContentService] Fallback YAML parse error in ${filePath}:`, err);
          return { frontmatter: {} as T, body };
        }
      }

      // Resilient recovery: user omitted or deleted closing '---'
      // Separate YAML from the first markdown heading (# ...) if present
      const headingMatch = fileContents.slice(3).search(/\r?\n#{1,6}\s+/);
      let rawYaml = "";
      let body = "";
      if (headingMatch !== -1) {
        rawYaml = fileContents.slice(3, 3 + headingMatch).trim();
        body = fileContents.slice(3 + headingMatch).trim();
      } else {
        rawYaml = fileContents.slice(3).trim();
      }
      try {
        const parsed = (yaml.load(rawYaml) as T) || ({} as T);
        return { frontmatter: parsed, body };
      } catch (err) {
        console.warn(`[ContentService] Resilient unclosed frontmatter YAML parse error in ${filePath}:`, err);
      }
    }

    return { frontmatter: {} as T, body: fileContents };
  } catch (err) {
    console.warn(`[ContentService] Could not read file ${filePath}:`, err);
    return { frontmatter: {} as T, body: "" };
  }
}

export function parseNotesMarkdown(markdown: string): NoteCard[] {
  const lines = markdown.split(/\r?\n/);
  const cards: NoteCard[] = [];
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  function flush() {
    if (currentTitle) {
      const blockText = currentLines.join("\n");
      const linkMatch = blockText.match(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]+|#[^\s)]+)\)/
      );
      if (linkMatch) {
        cards.push({
          id: `note-${cards.length + 1}`,
          title: currentTitle.trim(),
          linkText: linkMatch[1].trim() || "Open Resource",
          url: linkMatch[2].trim(),
        });
      } else {
        const bareUrlMatch = blockText.match(/(https?:\/\/[^\s)]+)/);
        if (bareUrlMatch) {
          cards.push({
            id: `note-${cards.length + 1}`,
            title: currentTitle.trim(),
            linkText: "Open Resource",
            url: bareUrlMatch[1].trim(),
          });
        } else {
          cards.push({
            id: `note-${cards.length + 1}`,
            title: currentTitle.trim(),
            linkText: "Curated Resource",
            url: "#",
          });
        }
      }
    }
    currentTitle = null;
    currentLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      flush();
      currentTitle = trimmed.slice(2).trim();
    } else if (currentTitle) {
      currentLines.push(line);
    }
  }
  flush();

  return cards;
}

function resolveArray<T>(parsedArray: T[] | undefined, defaultArray: T[]): T[] {
  if (Array.isArray(parsedArray)) {
    return parsedArray;
  }
  return defaultArray;
}

function resolveCollection<T>(fileExisted: boolean, parsedArray: T[] | undefined, defaultArray: T[]): T[] {
  if (Array.isArray(parsedArray)) {
    return parsedArray;
  }
  if (fileExisted) {
    return [];
  }
  return defaultArray;
}

const DEFAULT_FLIP_WORDS = [
  "Cybersecurity",
  "IoT Systems",
  "Computer Vision",
  "Deep Learning",
];

const DEFAULT_STATS: Stat[] = [
  { value: "7+", label: "Years Academic Experience" },
  { value: "10+", label: "Research Publications & Chapters" },
  { value: "4", label: "Scholarly Research Domains" },
  { value: "350+", label: "Students Mentored" },
];

export function loadAllContent(contentDir: string = path.join(process.cwd(), "content")): SiteContent {
  // 1. Home
  const homeFile = path.join(contentDir, "home.md");
  const homeParsed = parseMarkdownFile<Partial<HomeContent>>(homeFile);
  const home: HomeContent = {
    name: homeParsed.frontmatter.name || "Toufique Ahammad Gazi",
    role: homeParsed.frontmatter.role || "Assistant Professor · CSE & Cybersecurity",
    location: homeParsed.frontmatter.location || "Adamas University · Kolkata, India",
    headlinePrefix: homeParsed.frontmatter.headlinePrefix || "advancing",
    headlineSuffix: homeParsed.frontmatter.headlineSuffix || "& Intelligent Systems.",
    tagline:
      homeParsed.frontmatter.tagline ||
      "Investigating Cybersecurity, Threat Intelligence, IoT/Cloud Observability, and Intelligent Vision Systems. Mentoring the next generation of computer scientists and engineers.",
    flipWords: resolveArray(homeParsed.frontmatter.flipWords, DEFAULT_FLIP_WORDS),
    stats: resolveArray(homeParsed.frontmatter.stats, DEFAULT_STATS),
    actionButtons: resolveArray(homeParsed.frontmatter.actionButtons, [
      { label: "Publications", href: "#publications", primary: true },
      { label: "Research Focus", href: "#research", primary: false },
      { label: "Institutional Contact", href: "#contact", primary: false },
    ]),
    overview: homeParsed.body,
  };

  // 2. About
  const aboutFile = fs.existsSync(path.join(contentDir, "about.md"))
    ? path.join(contentDir, "about.md")
    : path.join(contentDir, "profile.md");
  const aboutExists = fs.existsSync(aboutFile);
  const aboutParsed = parseMarkdownFile<Partial<AboutContent>>(aboutFile);
  const about: AboutContent = {
    eyebrow: aboutParsed.frontmatter.eyebrow || "Faculty Overview",
    title: aboutParsed.frontmatter.title || "Academic Pedigree, Research & Core Vision.",
    subtitle: aboutParsed.frontmatter.subtitle || "Faculty Profile & Academic Mission",
    institution: aboutParsed.frontmatter.institution || "Adamas University, Kolkata",
    phdInstitution:
      aboutParsed.frontmatter.phdInstitution ||
      "University of Engineering & Management (UEM)",
    stats: resolveArray(aboutParsed.frontmatter.stats, DEFAULT_STATS),
    actionButtons: resolveArray(aboutParsed.frontmatter.actionButtons, [
      { label: "Explore Publications", href: "#publications", primary: true },
      { label: "Research Focus", href: "#research", primary: false },
      { label: "Get in Touch", href: "#contact", primary: false },
    ]),
    educationTitle: aboutParsed.frontmatter.educationTitle || "Education & Academic Pedigree",
    degrees: resolveCollection(aboutExists, aboutParsed.frontmatter.degrees, INITIAL_EDUCATION).map((d) => ({
      ...d,
      degree: d.degree || "",
      institution: d.institution || "",
      location: d.location || "",
      period: d.period || "",
      details: Array.isArray(d.details) ? d.details : [],
    })),
    skillsTitle: aboutParsed.frontmatter.skillsTitle || "Research Disciplines & Computing Tools",
    skillsEyebrow: aboutParsed.frontmatter.skillsEyebrow || "Technical Proficiencies & Research Tools",
    skills: resolveCollection(aboutExists, aboutParsed.frontmatter.skills, SKILL_CHIPS),
    bio: aboutParsed.body,
  };

  // 3. Research
  const researchFile = path.join(contentDir, "research.md");
  const researchExists = fs.existsSync(researchFile);
  const researchParsed = parseMarkdownFile<Partial<ResearchContent>>(researchFile);
  const research: ResearchContent = {
    eyebrow: researchParsed.frontmatter.eyebrow || "Research · 04 Focus Domains",
    title:
      researchParsed.frontmatter.title ||
      "Scholarly Inquiries, Defense Architecture & Applied Intelligence.",
    hint: resolveArray(researchParsed.frontmatter.hint, ["Scroll", "Stack"]),
    domains: resolveCollection(researchExists, researchParsed.frontmatter.domains, SERVICES).map((d, idx) => ({
      ...d,
      id: d.id || idx + 1,
      title: d.title || "Research Domain",
      description: d.description || "",
      icon: d.icon || "/assets/react.svg",
      bullets: Array.isArray(d.bullets) ? d.bullets : [],
    })),
    summary: researchParsed.body,
  };

  // 4. Publications
  const pubFile = path.join(contentDir, "publications.md");
  const pubExists = fs.existsSync(pubFile);
  const pubParsed = parseMarkdownFile<Partial<PublicationsContent>>(pubFile);
  const publications: PublicationsContent = {
    eyebrow: pubParsed.frontmatter.eyebrow || "Peer-Reviewed Contributions",
    title: pubParsed.frontmatter.title || "Scholarly Publications",
    summary:
      pubParsed.frontmatter.summary ||
      "Refereed journal papers, research articles, book chapters, conference presentations, and patent disclosures.",
    publications: resolveCollection(pubExists, pubParsed.frontmatter.publications, INITIAL_PUBLICATIONS).map((p, idx) => ({
      ...p,
      id: p.id || `pub-${idx + 1}`,
      title: p.title || "Untitled Publication",
      authors: p.authors || "Toufique Ahammad Gazi",
      year: String(p.year || new Date().getFullYear()),
      type: p.type || "Journal / Research Article",
      venue: p.venue || "",
      badge: p.badge || "Research",
      abstract: p.abstract || "",
      keywords: Array.isArray(p.keywords) ? p.keywords : [],
    })),
    bookChapters: resolveCollection(pubExists, pubParsed.frontmatter.bookChapters, INITIAL_BOOK_CHAPTERS).map((c, idx) => ({
      ...c,
      id: c.id || `chapter-${idx + 1}`,
      title: c.title || "Untitled Book Chapter",
      bookTitle: c.bookTitle || "",
      authors: c.authors || "Toufique Ahammad Gazi",
      publisher: c.publisher || "",
      year: String(c.year || new Date().getFullYear()),
      abstract: c.abstract || "",
      keywords: Array.isArray(c.keywords) ? c.keywords : [],
    })),
    conferences: resolveCollection(pubExists, pubParsed.frontmatter.conferences, INITIAL_CONFERENCES).map((cf, idx) => ({
      ...cf,
      id: cf.id || `conf-${idx + 1}`,
      title: cf.title || "Untitled Conference Paper",
      conference: cf.conference || "",
      year: String(cf.year || new Date().getFullYear()),
      role: cf.role || "Presenter",
      location: cf.location || "",
      abstract: cf.abstract || "",
      tags: Array.isArray(cf.tags) ? cf.tags : [],
    })),
    patents: resolveCollection(pubExists, pubParsed.frontmatter.patents, INITIAL_PATENTS).map((pt, idx) => ({
      ...pt,
      id: pt.id || `patent-${idx + 1}`,
      title: pt.title || "Untitled Patent",
      status: pt.status || "Pending",
      jurisdiction: pt.jurisdiction || "",
      inventors: Array.isArray(pt.inventors) ? pt.inventors : ["Toufique Ahammad Gazi"],
      abstract: pt.abstract || "",
    })),
  };

  // 5. Experience
  const expFile = path.join(contentDir, "experience.md");
  const expExists = fs.existsSync(expFile);
  const expParsed = parseMarkdownFile<Partial<ExperienceContent>>(expFile);
  const experience: ExperienceContent = {
    eyebrow: expParsed.frontmatter.eyebrow || "Career Timeline",
    title: expParsed.frontmatter.title || "Academic & Professional Experience",
    experiences: resolveCollection(expExists, expParsed.frontmatter.experiences, EXPERIENCES).map((e) => ({
      ...e,
      title: e.title || "",
      job: e.job || "",
      date: e.date || "",
      contents: Array.isArray(e.contents) ? e.contents : [],
    })),
    coursesTitle: expParsed.frontmatter.coursesTitle || "Undergraduate & Postgraduate Instruction",
    coursesTaught: resolveCollection(expExists, expParsed.frontmatter.coursesTaught, INITIAL_COURSES).map((c) => ({
      ...c,
      code: c.code || "",
      name: c.name || "",
      level: c.level || "",
      institution: c.institution || "",
      topics: c.topics || "",
    })),
    activitiesEyebrow: expParsed.frontmatter.activitiesEyebrow || "Pedagogy & Service",
    activitiesSectionTitle: expParsed.frontmatter.activitiesSectionTitle || "Courses Taught, Academic Service & Scholarly Profiles.",
    activitiesTitle: expParsed.frontmatter.activitiesTitle || "Academic Governance & Student Mentorship",
    activities: resolveCollection(expExists, expParsed.frontmatter.activities, INITIAL_ACTIVITIES).map((a) => ({
      ...a,
      role: a.role || "",
      organization: a.organization || "",
      period: a.period || "",
      description: a.description || "",
    })),
  };

  // 6. Projects
  const projFile = path.join(contentDir, "projects.md");
  const projExists = fs.existsSync(projFile);
  const projParsed = parseMarkdownFile<Partial<ProjectsContent>>(projFile);
  const rawProjects = resolveCollection(projExists, projParsed.frontmatter.projects, MY_PROJECTS);

  const projects: ProjectsContent = {
    eyebrow: projParsed.frontmatter.eyebrow || "Selected Initiatives",
    title: projParsed.frontmatter.title || "Research & Development Projects",
    notice:
      projParsed.frontmatter.notice ||
      "Academic prototypes and implementations supporting empirical publications.",
    projects: rawProjects.map((p, idx) => ({
      ...p,
      id: p.id || idx + 1,
      title: p.title || "Untitled Project",
      category: p.category || "Research Prototype",
      description: p.description || "",
      href: p.href || "#",
      accent: p.accent || "from-aqua/40 to-royal/10",
      image: p.image || "",
      logo: p.logo || "",
      tags: (p.tags || []).map((tag, tIdx) =>
        typeof tag === "string"
          ? { id: tIdx + 1, name: tag, path: "/assets/logos/javascript.svg" }
          : { id: tag.id || tIdx + 1, name: tag.name, path: tag.path || "/assets/logos/javascript.svg" }
      ),
      subDescription: p.subDescription || [],
    })),
  };

  // 7. Notes
  const notesFile = path.join(contentDir, "notes.md");
  let notesBody = "";
  if (fs.existsSync(notesFile)) {
    notesBody = fs.readFileSync(notesFile, "utf8");
  }
  const noteCards = parseNotesMarkdown(notesBody);
  const notes: NotesContent = {
    eyebrow: "Courseware & Academic Archives",
    title: "Lecture Notes, Documents & External Resources.",
    cards: noteCards,
  };

  // 8. Contact
  const contactFile = path.join(contentDir, "contact.md");
  const contactExists = fs.existsSync(contactFile);
  const contactParsed = parseMarkdownFile<Partial<ContactContent>>(contactFile);
  const contact: ContactContent = {
    email: contactParsed.frontmatter.email || "toufique.gazi@adamasuniversity.ac.in",
    alternateEmail: contactParsed.frontmatter.alternateEmail,
    department:
      contactParsed.frontmatter.department || "Department of Computer Science & Engineering",
    school: contactParsed.frontmatter.school || "School of Engineering & Technology (SOET)",
    institution: contactParsed.frontmatter.institution || "Adamas University",
    campusAddress:
      contactParsed.frontmatter.campusAddress ||
      "Barasat - Barrackpore Road, 24 Parganas North, Kolkata, West Bengal 700126, India",
    introEyebrow: contactParsed.frontmatter.introEyebrow || "Institutional Correspondence",
    introTitle:
      contactParsed.frontmatter.introTitle ||
      "Academic Dialogue & Scholarly Collaboration.",
    introDescription:
      contactParsed.frontmatter.introDescription ||
      "Welcome to reach out regarding collaborative research proposals, graduate advising, conference review invitations, guest lectures, or technical consultations in Cybersecurity and Computer Vision.",
    profilesEyebrow:
      contactParsed.frontmatter.profilesEyebrow ||
      "Verified Academic Identifiers & Indexes",
    formEyebrow: contactParsed.frontmatter.formEyebrow || "Academic Dispatch",
    formTitle: contactParsed.frontmatter.formTitle || "Send a Direct Communication",
    socials: resolveCollection(contactExists, contactParsed.frontmatter.socials, INITIAL_LINKS).map((s) => ({
      ...s,
      name: s.name || "",
      label: s.label || s.name || "",
      url: s.url || "#",
      description: s.description || "",
      icon: s.icon || "ExternalLink",
    })),
  };

  return {
    home,
    about,
    research,
    publications,
    experience,
    projects,
    notes,
    contact,
  };
}
