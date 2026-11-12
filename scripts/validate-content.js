#!/usr/bin/env node
/**
 * Content Validation Script for Toufique Ahammad Gazi Portfolio.
 * Validates Markdown files and YAML frontmatter in content/
 * Produces clear, readable error messages distinguishing fatal errors from warnings.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const CONTENT_DIR = path.resolve(process.cwd(), "content");

function parseFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: `File not found: ${filePath}`, frontmatter: null, body: "" };
  }

  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  if (!raw.startsWith("---")) {
    return { frontmatter: {}, body: raw };
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n([\s\S]*))?$/);
  if (match) {
    try {
      const parsed = yaml.load(match[1]) || {};
      return { frontmatter: parsed, body: (match[2] || "").trim() };
    } catch (e) {
      return { error: `Invalid YAML syntax in ${path.basename(filePath)}: ${e.message}`, frontmatter: null, body: "" };
    }
  }

  const secondDash = raw.indexOf("---", 3);
  if (secondDash !== -1) {
    try {
      const parsed = yaml.load(raw.slice(3, secondDash)) || {};
      return { frontmatter: parsed, body: raw.slice(secondDash + 3).trim() };
    } catch (e) {
      return { error: `Invalid YAML syntax in ${path.basename(filePath)}: ${e.message}`, frontmatter: null, body: "" };
    }
  }

  // Resilient recovery if user accidentally omitted closing '---'
  const headingMatch = raw.slice(3).search(/\r?\n#{1,6}\s+/);
  let rawYaml = "";
  let body = "";
  if (headingMatch !== -1) {
    rawYaml = raw.slice(3, 3 + headingMatch).trim();
    body = raw.slice(3 + headingMatch).trim();
  } else {
    rawYaml = raw.slice(3).trim();
  }
  try {
    const parsed = yaml.load(rawYaml) || {};
    return { frontmatter: parsed, body, warning: `Missing closing '---' delimiter in ${path.basename(filePath)}` };
  } catch (e) {
    return { error: `Invalid YAML syntax or missing closing '---' in ${path.basename(filePath)}: ${e.message}`, frontmatter: null, body: "" };
  }
}

function isValidUrl(string) {
  if (!string || typeof string !== "string") return false;
  if (string.startsWith("/") || string.startsWith("#") || string.startsWith("mailto:")) return true;
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function validateAll(contentDir = CONTENT_DIR) {
  const errors = [];
  const warnings = [];

  const requiredFiles = [
    "home.md",
    "about.md",
    "research.md",
    "publications.md",
    "experience.md",
    "projects.md",
    "notes.md",
    "contact.md",
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(contentDir, file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing essential content file: content/${file}`);
    }
  }

  if (errors.length > 0) {
    return { errors, warnings, valid: false };
  }

  // 1. Home
  const home = parseFrontmatter(path.join(contentDir, "home.md"));
  if (home.error) errors.push(home.error);
  else if (home.frontmatter) {
    const fm = home.frontmatter;
    if (!fm.name) warnings.push("content/home.md: 'name' field is missing or empty.");
    if (!fm.role) warnings.push("content/home.md: 'role' field is missing or empty.");
  }

  // 2. About
  const about = parseFrontmatter(path.join(contentDir, "about.md"));
  if (about.error) errors.push(about.error);
  else if (about.frontmatter) {
    const fm = about.frontmatter;
    if (Array.isArray(fm.degrees)) {
      fm.degrees.forEach((deg, idx) => {
        const id = deg.degree || `degree[${idx}]`;
        if (!deg.degree) errors.push(`content/about.md: Degree entry #${idx + 1} is missing the required 'degree' name.`);
        if (!deg.institution) errors.push(`content/about.md: Degree '${id}' is missing the required 'institution' field.`);
      });
    }
  }

  // 3. Research
  const research = parseFrontmatter(path.join(contentDir, "research.md"));
  if (research.error) errors.push(research.error);
  else if (research.frontmatter) {
    const fm = research.frontmatter;
    if (Array.isArray(fm.domains)) {
      fm.domains.forEach((dom, idx) => {
        const id = dom.title || dom.id || `domain[${idx}]`;
        if (!dom.title) errors.push(`content/research.md: Domain entry #${idx + 1} is missing the required 'title' field.`);
        if (!dom.description) warnings.push(`content/research.md: Domain '${id}' has no description.`);
      });
    }
  }

  // 4. Publications
  const pub = parseFrontmatter(path.join(contentDir, "publications.md"));
  if (pub.error) errors.push(pub.error);
  else if (pub.frontmatter) {
    const fm = pub.frontmatter;
    if (Array.isArray(fm.publications)) {
      fm.publications.forEach((p, idx) => {
        const id = p.id || `publication[${idx}]`;
        if (!p.title) errors.push(`content/publications.md: Record '${id}' is missing the required 'title' field.`);
        if (!p.authors) errors.push(`content/publications.md: Record '${id}' is missing the required 'authors' field.`);
        if (!p.year) errors.push(`content/publications.md: Record '${id}' is missing the required 'year' field.`);
        if (p.url && !isValidUrl(p.url)) warnings.push(`content/publications.md: Record '${id}' has an invalid URL format: "${p.url}"`);
      });
    }
    if (Array.isArray(fm.bookChapters)) {
      fm.bookChapters.forEach((bc, idx) => {
        const id = bc.id || `bookChapter[${idx}]`;
        if (!bc.title) errors.push(`content/publications.md: Book chapter '${id}' is missing the required 'title' field.`);
        if (!bc.bookTitle) errors.push(`content/publications.md: Book chapter '${id}' is missing the required 'bookTitle' field.`);
        if (!bc.publisher) warnings.push(`content/publications.md: Book chapter '${id}' is missing the 'publisher' field.`);
      });
    }
    if (Array.isArray(fm.conferences)) {
      fm.conferences.forEach((cf, idx) => {
        const id = cf.id || `conference[${idx}]`;
        if (!cf.title) errors.push(`content/publications.md: Conference record '${id}' is missing the required 'title' field.`);
        if (!cf.conference) errors.push(`content/publications.md: Conference record '${id}' is missing the required 'conference' name.`);
      });
    }
    if (Array.isArray(fm.patents)) {
      fm.patents.forEach((pt, idx) => {
        const id = pt.id || `patent[${idx}]`;
        if (!pt.title) errors.push(`content/publications.md: Patent record '${id}' is missing the required 'title' field.`);
        if (!pt.status) warnings.push(`content/publications.md: Patent record '${id}' is missing 'status'.`);
      });
    }
  }

  // 5. Experience
  const exp = parseFrontmatter(path.join(contentDir, "experience.md"));
  if (exp.error) errors.push(exp.error);
  else if (exp.frontmatter) {
    const fm = exp.frontmatter;
    if (Array.isArray(fm.experiences)) {
      fm.experiences.forEach((e, idx) => {
        const id = e.title || `experience[${idx}]`;
        if (!e.title) errors.push(`content/experience.md: Experience entry #${idx + 1} is missing the required 'title' field.`);
        if (!e.job) errors.push(`content/experience.md: Experience '${id}' is missing the required 'job' field.`);
      });
    }
    if (Array.isArray(fm.coursesTaught)) {
      fm.coursesTaught.forEach((c, idx) => {
        const id = c.code || c.name || `course[${idx}]`;
        if (!c.code && !c.name) errors.push(`content/experience.md: Course entry #${idx + 1} is missing both 'code' and 'name'.`);
      });
    }
  }

  // 6. Projects
  const proj = parseFrontmatter(path.join(contentDir, "projects.md"));
  if (proj.error) errors.push(proj.error);
  else if (proj.frontmatter) {
    const fm = proj.frontmatter;
    if (Array.isArray(fm.projects)) {
      fm.projects.forEach((p, idx) => {
        const id = p.title || p.id || `project[${idx}]`;
        if (!p.title) errors.push(`content/projects.md: Project entry #${idx + 1} is missing the required 'title' field.`);
        if (!p.description) warnings.push(`content/projects.md: Project '${id}' has no description.`);
        if (p.href && !isValidUrl(p.href)) warnings.push(`content/projects.md: Project '${id}' has an invalid URL format: "${p.href}"`);
      });
    }
  }

  // 7. Contact
  const contact = parseFrontmatter(path.join(contentDir, "contact.md"));
  if (contact.error) errors.push(contact.error);
  else if (contact.frontmatter) {
    const fm = contact.frontmatter;
    if (fm.email && !fm.email.includes("@")) {
      warnings.push(`content/contact.md: Email '${fm.email}' does not appear to be a valid email address.`);
    }
    if (Array.isArray(fm.socials)) {
      fm.socials.forEach((s, idx) => {
        const id = s.name || `social[${idx}]`;
        if (!s.name) errors.push(`content/contact.md: Social link entry #${idx + 1} is missing 'name'.`);
        if (!s.url) errors.push(`content/contact.md: Social link '${id}' is missing the required 'url' field.`);
        else if (!isValidUrl(s.url)) warnings.push(`content/contact.md: Social link '${id}' has an invalid URL: "${s.url}"`);
      });
    }
  }

  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };
}

// Direct CLI execution
if (require.main === module) {
  const result = validateAll();

  console.log("\n==========================================");
  console.log("  Academic Portfolio Content Validation   ");
  console.log("==========================================\n");

  if (result.warnings.length > 0) {
    console.log(`[WARNINGS] (${result.warnings.length} nonfatal notice(s)):`);
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    console.log("");
  }

  if (!result.valid) {
    console.error(`[FATAL ERRORS] (${result.errors.length} error(s) must be resolved):`);
    result.errors.forEach((e) => console.error(`  ✖ ${e}`));
    console.error("\nBuild aborted: invalid essential content detected. Please fix the above errors in content/.\n");
    process.exit(1);
  }

  console.log("✔ All Markdown content validated successfully. Zero fatal errors.\n");
  process.exit(0);
}

module.exports = { validateAll, parseFrontmatter };
