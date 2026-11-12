# Toufique Ahammad Gazi — Academic Portfolio

An interactive, 3D academic portfolio showcasing the research, academic journey, publications, projects, and professional contributions of **Toufique Ahammad Gazi**, Assistant Professor in the Department of Computer Science & Engineering at **Adamas University, Kolkata, India**.

Designed as a modern digital academic presence, the website brings together scholarly work, research interests, academic experience, and technical projects through an immersive interface featuring interactive 3D graphics, smooth animations, and a responsive design.

---

## Overview

**Toufique Ahammad Gazi**  
Assistant Professor  
Department of Computer Science & Engineering  
School of Engineering & Technology (SOET)  
Adamas University, Kolkata, India

The portfolio focuses on academic research and technical contributions across several areas of computer science, including:

- Cybersecurity and Threat Intelligence
- Cyber Kill Chain Threat Modeling
- Exploit Kit Analysis
- Cloud and IoT Security
- Cloud Observability
- Real-Time Computer Vision
- Sports Analytics
- Multitask Transfer Learning

The website serves as a centralized platform for exploring academic qualifications, professional experience, research domains, scholarly publications, book chapters, conference contributions, projects, patents, and academic activities.

---

## Website Highlights

### Interactive 3D Experience
- Procedurally generated 3D shader globe with mathematical geometry and WebGL effects.
- Interactive 3D hero environment featuring a floating astronaut model.
- Responsive camera movement and cursor-based interactions.
- Dynamic visual elements designed to create an immersive academic experience.

### Motion & Interaction
- Smooth scroll-linked animations and transitions.
- Interactive academic experience timeline.
- Stacked research focus cards.
- Horizontally pinned project showcase.
- Responsive navigation and mobile-friendly interactions.
- Carefully designed light and dark themes.

### Academic Presentation
- Structured faculty profile and biography.
- Academic qualifications and professional experience.
- Dedicated research areas and scientific interests.
- Research publications and book chapters.
- Conference presentations and proceedings.
- Academic projects and research prototypes.
- Patent information and academic activities.
- External academic and professional profile links.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 — Strict Mode |
| Frontend | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| 3D Graphics | Three.js (r184) |
| React 3D Rendering | React Three Fiber |
| 3D Utilities | React Three Drei, Maath |
| Animations | Motion |
| Content Management | Markdown with YAML Frontmatter |
| Hosting | GitHub Pages |
| Deployment | GitHub Actions |

### Architecture

The application follows a modular architecture that separates the visual presentation, reusable components, academic content, and supporting utilities.

Academic content is maintained in structured Markdown files, while the interface and animations are implemented using React and TypeScript.

The website uses Next.js static export to generate a production-ready collection of static files, making it suitable for free static hosting.

---

## Project Structure

```text
PortFolio Website/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── about/
│   ├── contact/
│   ├── globe/
│   ├── navbar/
│   ├── portfolio/
│   ├── projects/
│   ├── sections/
│   └── ui/
│
├── constants/
├── helpers/
├── hooks/
│
├── content/
│   ├── profile.md
│   ├── education.md
│   ├── experience.md
│   ├── research.md
│   ├── publications.md
│   ├── book-chapters.md
│   ├── conferences.md
│   ├── projects.md
│   ├── patents.md
│   ├── academic-activities.md
│   └── links.md
│
├── lib/
│
├── public/
│   ├── .nojekyll
│   ├── assets/
│   ├── content/
│   └── models/
│       └── astronaut.glb
│
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Content Management

One of the central design principles of this portfolio is the separation of academic content from the application code.

The `content/` directory contains the Markdown files used to maintain the information displayed throughout the website.

Academic information can be updated without modifying React components or application logic.

### Available Content Files

| File | Description |
|---|---|
| `profile.md` | Faculty profile, biography, designation, and academic statistics |
| `education.md` | Educational qualifications and academic background |
| `experience.md` | Professional appointments and academic experience |
| `research.md` | Research domains, scientific interests, and focus areas |
| `publications.md` | Research papers and journal publications |
| `book-chapters.md` | Authored and contributed book chapters |
| `conferences.md` | Conference presentations and proceedings |
| `projects.md` | Research projects, prototypes, and technical work |
| `patents.md` | Patent records and application information |
| `academic-activities.md` | Teaching, workshops, committees, and academic activities |
| `links.md` | Google Scholar, ResearchGate, ORCID, and other academic profiles |

### Editing Academic Information

Content files use Markdown and YAML Frontmatter to organize information into structured records.

For example, a publication entry can be maintained in `content/publications.md`:

```yaml
- id: "publication-id"
  title: "Research Paper Title"
  authors: "Toufique Ahammad Gazi, Co-Author Name"
  year: "2026"
  type: "Journal / Research Article"
  venue: "Journal or Conference Name"
  badge: "Cybersecurity"
  abstract: "A brief summary of the research contribution."
  doi: "10.xxxx/example"
  url: "https://doi.org/10.xxxx/example"
  keywords:
    - Cybersecurity
    - Threat Intelligence
    - Network Security
```

To add or update academic information:

1. Open the relevant Markdown file inside `content/`.
2. Add a new record or edit an existing one.
3. Save the changes.
4. Commit the changes to the GitHub repository.
5. The deployment workflow rebuilds the website and publishes the updated content.

**No direct modification of the frontend code is required for routine academic content updates.**

---

## Getting Started

### Prerequisites

- Node.js 20.9.0 or later
- npm 10 or later
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/dipayansamanta172-lgtm/Toufique-Ahammad-Gazi-Portfolio-.git
```

### 2. Navigate to the Project

```bash
cd Toufique-Ahammad-Gazi-Portfolio-
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

The development server supports local preview and development of the portfolio.

---

## Production Build

The project uses Next.js static export to generate the production website.

Run:

```bash
npm run build
```

The generated static website is available in the `out/` directory.

The output contains the static HTML, CSS, JavaScript, and required assets needed to serve the portfolio without a dedicated application server.

---

## GitHub Pages Deployment

The portfolio is configured for automated deployment using GitHub Actions.

### Deployment Configuration

The project supports repository-based deployment through the `NEXT_PUBLIC_BASE_PATH` environment variable.

For a GitHub repository named:

```text
Toufiq-Ahammad-Gazi-Portfolio-
```

the base path must match the actual repository name:

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/Toufiq-Ahammad-Gazi-Portfolio-"
npm run build
```

For local development, a custom domain, or a root-level deployment, configure the base path according to the deployment environment.

### Enable GitHub Pages

1. Open the repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Ensure the deployment workflow is present in `.github/workflows/deploy.yml`.
5. Push changes to the configured deployment branch.
6. Monitor the workflow from the **Actions** tab.

Once configured, GitHub Actions automatically builds and publishes the website when changes are pushed to the deployment branch.

---

## Static Hosting & Performance

The portfolio is designed to operate as a fully static website.

Key characteristics:

- No dedicated backend server required for hosting.
- No database required for academic content management.
- Static production output through Next.js export.
- Automated deployment through GitHub Actions.
- Suitable for GitHub Pages and other static hosting platforms.
- Modular content architecture for easier maintenance.

The 3D scenes and animations are integrated into the frontend and are designed to provide an interactive experience across supported devices.

---

## Academic & Professional Identity

**Toufique Ahammad Gazi**  
Assistant Professor, Department of Computer Science & Engineering  
School of Engineering & Technology  
Adamas University, Kolkata, India

Research interests include Cybersecurity, Threat Intelligence, Cloud and IoT Security, Computer Vision, Sports Analytics, and Machine Learning.

The portfolio provides a unified academic presence for presenting research contributions, scholarly publications, professional experience, and ongoing technical work.

---

## License & Attribution

- **Academic content and scholarly records:** © Toufique Ahammad Gazi.
- **Third-party assets:** Individual assets remain subject to their respective licenses and attribution requirements.
- **Open-source dependencies:** Governed by their respective licenses.

For third-party models, graphics, and other externally sourced assets, refer to their original license and attribution information.

---

**Academic Portfolio of Toufique Ahammad Gazi**  
*Research. Innovation. Academic Excellence.*