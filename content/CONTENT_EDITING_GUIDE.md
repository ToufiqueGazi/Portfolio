# Faculty Portfolio Content Editing Guide

Welcome! This guide explains how to edit and update all the information on your academic portfolio website directly through **GitHub** in your web browser. 

You do **not** need to install programming software (like VS Code), run terminal commands, or know React, TypeScript, HTML, or CSS. All editable website content is managed through clean, readable **Markdown files** (`.md`) inside the `content/` folder.

---

## Table of Contents

1. [How to Edit Content on GitHub in Your Browser](#1-how-to-edit-content-on-github-in-your-browser)
2. [What Each Markdown File Controls](#2-what-each-markdown-file-controls)
3. [Required vs. Optional Fields by Section](#3-required-vs-optional-fields-by-section)
4. [Step-by-Step Examples](#4-step-by-step-examples)
   - [4.1 Adding a Publication](#41-adding-a-publication)
   - [4.2 Deleting a Publication](#42-deleting-a-publication)
   - [4.3 Editing an Existing Project](#43-editing-an-existing-project)
   - [4.4 Adding an Academic Activity or Course](#44-adding-an-academic-activity-or-course)
   - [4.5 Adding a Resource Card in Notes](#45-adding-a-resource-card-in-notes)
5. [Automatic Publishing via GitHub Actions](#5-automatic-publishing-via-github-actions)
6. [How to Recognize a Successful Deployment](#6-how-to-recognize-a-successful-deployment)
7. [What to Do if Content Validation Fails](#7-what-to-do-if-content-validation-fails)
8. [Formatting Rules & Common Mistakes to Avoid](#8-formatting-rules--common-mistakes-to-avoid)

---

## 1. How to Edit Content on GitHub in Your Browser

Whenever you want to update your portfolio:

1. **Open your repository on GitHub** in any web browser.
2. Click on the **`content/`** folder.
3. Click on the file you wish to update (e.g., `publications.md`, `about.md`, or `projects.md`).
4. Click the **Pencil icon** (✏️) in the top right corner to start editing.
5. Make your edits following the examples in this guide.
6. When finished, click the green **Commit changes...** button in the upper right.
7. Type a short description of what you changed (e.g., "Add 2026 journal paper") and click **Commit changes**.
8. **That's it!** GitHub Actions will automatically validate your content, rebuild the website, and publish the update to GitHub Pages within 1–2 minutes.

---

## 2. What Each Markdown File Controls

Your website content is organized into 8 files in `content/`:

| File | Section on Website | What It Controls |
|---|---|---|
| **`content/home.md`** | Hero (Top section) | Name, role/designation, location, tagline, animated flip words, and statistics. |
| **`content/about.md`** | About & Pedigree | Biography, statistics cards, academic degrees/pedigree, and research skill chips. |
| **`content/research.md`** | Research Focus | Research inquiry domains, domain descriptions, and bullet points. |
| **`content/publications.md`** | Publications | Refereed journal articles, book chapters, conference presentations, and patents. |
| **`content/experience.md`** | Experience & Pedagogy | Academic appointments, courses taught, and academic governance/activities. |
| **`content/projects.md`** | Selected Projects | Research prototypes, descriptions, sub-bullets, tags, and project URLs. |
| **`content/notes.md`** | Notes & Resources | Resource cards for lecture slides, courseware, Google Drive links, and syllabi. |
| **`content/contact.md`** | Contact & Profiles | Institutional email, campus address, school/department, and academic profiles. |

---

## 3. Required vs. Optional Fields by Section

### Publications (`content/publications.md`)
- **Required fields:** `title`, `authors`, `year`
- **Optional fields:** `id`, `type`, `venue`, `badge`, `abstract`, `doi`, `url`, `keywords`

### Book Chapters (`content/publications.md`)
- **Required fields:** `title`, `bookTitle`, `authors`, `publisher`, `year`
- **Optional fields:** `id`, `isbn`, `doi`, `url`, `abstract`, `keywords`

### Conference Presentations (`content/publications.md`)
- **Required fields:** `title`, `conference`, `year`
- **Optional fields:** `id`, `role`, `location`, `abstract`, `tags`

### Patents (`content/publications.md`)
- **Required fields:** `title`, `status`
- **Optional fields:** `id`, `applicationNumber`, `filingDate`, `jurisdiction`, `inventors`, `abstract`

### Research Projects (`content/projects.md`)
- **Required fields:** `title`, `description`
- **Optional fields:** `id`, `category`, `subDescription`, `href`, `tags`, `accent`, `image`, `logo`

### Academic Degrees (`content/about.md`)
- **Required fields:** `degree`, `institution`
- **Optional fields:** `location`, `period`, `details`

### Experiences (`content/experience.md`)
- **Required fields:** `title`, `job`
- **Optional fields:** `date`, `contents`

### Courses Taught (`content/experience.md`)
- **Required fields:** `code` or `name`
- **Optional fields:** `level`, `institution`, `topics`

### Academic Activities (`content/experience.md`)
- **Required fields:** `role`, `organization`
- **Optional fields:** `period`, `description`

---

## 4. Step-by-Step Examples

### 4.1 Adding a Publication
Open `content/publications.md`. Under `publications:`, add a new entry with two spaces indentation:

```yaml
  - id: "pub-2027-deep-telemetry"
    title: "Graph-Based Threat Telemetry in Zero-Trust Distributed Environments"
    authors: "Toufique Ahammad Gazi, et al."
    year: "2027"
    type: "Journal / Research Article"
    venue: "IEEE Transactions on Network and Service Management"
    badge: "Cybersecurity"
    abstract: "Investigating real-time graph neural networks for automated lateral movement detection in high-throughput cloud networks."
    doi: "10.1109/TNSM.2027.0001"
    url: "https://scholar.google.com/"
    keywords:
      - "Graph Neural Networks"
      - "Zero-Trust"
      - "Telemetry"
```

### 4.2 Deleting a Publication
1. Open `content/publications.md`.
2. Locate the publication block you wish to remove (from `- id: ...` down to the next publication item).
3. Delete the lines.
4. Commit your changes.
5. The publication will automatically disappear from the website upon deployment.

### 4.3 Editing an Existing Project
Open `content/projects.md`. Find the project under `projects:` and edit any of its fields:

```yaml
  - id: 1
    title: "Cyber Threat Telemetry & Kill-Chain Sentinel (Updated)"
    category: "Cybersecurity Research Prototype"
    description: "Automated threat intelligence and kernel telemetry framework mapping real-time attack flows."
    subDescription:
      - "Designed eBPF-driven kernel probes for non-intrusive syscall tracing."
      - "Integrated automated rule synthesis for mitigation."
    href: "https://github.com/toufiquegazi/killchain-sentinel"
```

### 4.4 Adding an Academic Activity or Course
Open `content/experience.md`. Under `activities:`, append:

```yaml
  - role: "Session Chair & Track Organizer"
    organization: "International Conference on Security & Privacy"
    period: "2026"
    description: "Chaired technical session on Network Telemetry and Adversarial Machine Learning."
```

### 4.5 Adding a Resource Card in Notes
Open `content/notes.md`. Add a new section at the bottom:

```markdown
# Advanced Network Security Laboratory Manual

[Open PDF Document](https://drive.google.com/your-lab-manual-link)
```
- Every top-level heading (`# Title`) automatically generates a distinct resource card.
- The link on the line below specifies the button label and destination.

---

## 5. Automatic Publishing via GitHub Actions

Your repository has a GitHub Actions workflow configured in `.github/workflows/deploy.yml`:

```
Edit on GitHub → Commit Changes → GitHub Actions Triggered → Content Validated → Website Built → Deployed to GitHub Pages
```

The entire process runs autonomously in the cloud without requiring your computer.

---

## 6. How to Recognize a Successful Deployment

1. On your repository page on GitHub, click the **Actions** tab at the top.
2. You will see a list of recent workflow runs.
3. Look at the top entry:
   - 🟡 **Yellow circle:** Build is currently in progress (takes about 60–90 seconds).
   - 🟢 **Green checkmark:** Deployment succeeded! Your changes are live on the website.
   - 🔴 **Red cross:** The build encountered an issue (usually a typo in Markdown).

---

## 7. What to Do if Content Validation Fails

If a red cross (🔴) appears in the Actions tab:

1. Click on the failed workflow run.
2. Click on the **build** job on the left.
3. Click on the step named **Validate Markdown Content**.
4. Read the error message. It will tell you the exact file, entry, and missing field, for example:
   ```
   content/publications.md: Record 'pub-2027-example' is missing the required 'title' field.
   ```
5. Return to the file on GitHub, fix the missing field or indentation typo, and commit.
6. GitHub Actions will re-run automatically.

---

## 8. Formatting Rules & Common Mistakes to Avoid

1. **Always wrap titles with special characters in quotes:**  
   If your title contains colons (`:`), ampersands (`&`), or quotes, wrap it in double quotes:
   ```yaml
   # Correct:
   title: "Zero-Day Attacks: A Comprehensive Analysis"

   # Incorrect (causes YAML syntax error):
   title: Zero-Day Attacks: A Comprehensive Analysis
   ```
2. **Use two spaces for indentation (never tabs):**  
   YAML is sensitive to spacing. Always indent sub-items with two spaces:
   ```yaml
   publications:
     - id: "my-id"
       title: "My Paper"
   ```
3. **Keep the `---` delimiters intact:**  
   Every file starts and ends its metadata section with `---`. Do not delete these dashes.
4. **Valid URLs:**  
   Ensure all web addresses begin with `https://` or `http://` (or `/` for local paths).
