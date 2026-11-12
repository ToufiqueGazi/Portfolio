import {
  ProfileData,
  EducationItem,
  ExperienceItem,
  ResearchArea,
  PublicationItem,
  BookChapterItem,
  ConferenceItem,
  ProjectItem,
  PatentItem,
  CourseTaughtItem,
  AcademicActivityItem,
  LinkItem,
} from "./content-loader";

export const INITIAL_PROFILE: ProfileData = {
  name: "Toufique Ahammad Gazi",
  title: "Assistant Professor in Computer Science & Engineering",
  department: "Department of Computer Science & Engineering",
  institution: "School of Engineering & Technology (SOET), Adamas University",
  location: "Kolkata, West Bengal, India",
  email: "toufique.gazi@adamasuniversity.ac.in",
  alternateEmail: "toufique.cse@gmail.com",
  avatar: "/assets/profile.jpg",
  status: "Faculty Member & Researcher",
  resumeUrl: "#contact",
  bioShort:
    "Assistant Professor in Computer Science & Engineering at Adamas University, investigating Cybersecurity, Threat Intelligence, Cloud & IoT Security, and Computer Vision.",
  tagline: "Bridging Cyber Defense Architectures, IoT Security & Intelligent Vision Systems",
  stats: [
    { label: "Academic Experience", value: "7+ Yrs" },
    { label: "Scholarly Publications", value: "10+" },
    { label: "Research Domains", value: "4" },
    { label: "Students Mentored", value: "350+" },
  ],
  bioFull:
    "Toufique Ahammad Gazi is an Assistant Professor in the Department of Computer Science & Engineering at the School of Engineering & Technology (SOET), Adamas University, Kolkata, India. With an extensive background in both core computing systems and applied machine learning, his work focuses on advancing cyber defense architectures, IoT/cloud network security, and real-time computer vision systems.\n\nHe has contributed peer-reviewed research papers and scholarly book chapters with leading international academic publishers including IGI Global. His current research investigations center on cyber threat intelligence, exploit kit dissection, cyber kill chain analysis, and multitask transfer learning for heterogeneous multimodal data streams.\n\nAt Adamas University, he is actively engaged in undergraduate and postgraduate teaching, curriculum development, laboratory instruction, and guiding capstone research projects.",
};

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    degree: "Ph.D. in Computer Science & Engineering (Pursuing)",
    institution: "University of Engineering & Management (UEM)",
    location: "Kolkata, India",
    period: "Ongoing",
    details: [
      "Research Focus: Cybersecurity, Exploit Kit Analysis, and Network Observability",
      "Investigating automated kill chain disruption and transfer learning anomaly detection",
    ],
  },
  {
    degree: "M.Tech in Computer Science & Engineering",
    institution: "Supreme Knowledge Foundation Group of Institutions",
    location: "West Bengal, India",
    period: "Postgraduate",
    details: [
      "Specialization in Advanced Computer Science & Distributed Systems",
      "First Class Academic Distinction",
    ],
  },
  {
    degree: "B.Tech in Information Technology",
    institution: "Kalyani Government Engineering College (KGEC)",
    location: "Kalyani, West Bengal, India",
    period: "Undergraduate",
    details: [
      "Comprehensive grounding in Operating Systems, Networks, Computer Architecture, and Algorithms",
    ],
  },
  {
    degree: "Diploma in Computer Science & Technology",
    institution: "Bengal Institute of Technology",
    location: "Kolkata, West Bengal, India",
    period: "Foundational Diploma",
    details: [
      "Practical foundation in Software Development, Microprocessors, and Digital Circuits",
    ],
  },
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    role: "Assistant Professor",
    institution: "Adamas University",
    department: "Department of Computer Science & Engineering, SOET",
    period: "Present",
    location: "Kolkata, West Bengal, India",
    highlights: [
      "Delivering core undergraduate and postgraduate coursework in Network Security, Operating Systems, Machine Learning, and Algorithms.",
      "Mentoring student capstone engineering projects and faculty-guided research papers.",
      "Designing laboratory modules with hands-on packet inspection, ethical hacking frameworks, and AI experimentation.",
      "Serving on departmental academic committees and curriculum modernization teams.",
    ],
  },
  {
    role: "Assistant Professor / Faculty Member",
    institution: "Brainware University",
    department: "Department of Computer Science & Engineering",
    period: "Past Appointment",
    location: "Kolkata, West Bengal, India",
    highlights: [
      "Taught foundational computing and software engineering courses.",
      "Guided undergraduate students in database systems, networking, and security projects.",
      "Coordinated technical workshops and departmental seminars.",
    ],
  },
];

export const INITIAL_RESEARCH: ResearchArea[] = [
  {
    id: "cybersecurity",
    title: "Threat Intelligence & Cyber Kill Chain Defense",
    badge: "Cyber Defense",
    icon: "ShieldAlert",
    description:
      "Systematic investigation of modern exploit kits, polymorphic malware vectors, and zero-day vulnerabilities through automated cyber kill chain mapping and dynamic endpoint monitoring.",
    topics: [
      "Exploit kit telemetry and attack surface minimization",
      "Cyber kill chain phase disruption and real-time incident mitigation",
      "Autonomous host and network anomaly detection",
    ],
  },
  {
    id: "cloud-iot",
    title: "Cloud & IoT Network Security Observability",
    badge: "Distributed Systems",
    icon: "Network",
    description:
      "Designing lightweight cryptographic handshakes, secure protocol wrappers, and observability frameworks for resource-constrained IoT clusters and virtualized cloud infrastructure.",
    topics: [
      "Lightweight mutual authentication for smart sensors",
      "Network telemetry and observability under adversarial loads",
      "Microsegmentation and zero-trust cloud network architecture",
    ],
  },
  {
    id: "ai-vision",
    title: "Computer Vision & Deep Learning in Sports Analytics",
    badge: "Computer Vision",
    icon: "Eye",
    description:
      "Developing robust spatio-temporal computer vision models for high-velocity real-time tracking, sports analytics, player trajectory estimation, and continuous event detection.",
    topics: [
      "Real-time multi-agent player tracking and pose estimation",
      "Low-latency frame processing on edge GPU hardware",
      "Adaptive convolutional and transformer vision backbones",
    ],
  },
  {
    id: "multimodal-ml",
    title: "Multimodal Systems & Continual Transfer Learning",
    badge: "Machine Learning",
    icon: "Cpu",
    description:
      "Investigating dynamic multitask transfer learning with adaptive feature sharing across heterogeneous data modalities (sensor streams, structured logs, and perceptual features).",
    topics: [
      "Continual learning without catastrophic forgetting",
      "Cross-modal representation alignment for recommendation engines",
      "Healthcare telemetry and sensor-driven chronic disease monitoring",
    ],
  },
];

export const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: "pub-2026-killchain",
    title:
      "Unraveling Cyber Threats: An In-Depth Examination of Exploit Kits and Zero-Day Attacks Through the Lens of Kill Chain Analysis",
    authors: "Toufique Ahammad Gazi, et al.",
    year: "2026",
    type: "Journal / Research Article",
    venue: "International Journal of Cyber Threat Intelligence & Network Defense",
    badge: "Cybersecurity",
    abstract:
      "Modern cyber adversaries continuously refine automated exploit kits and weaponize undisclosed zero-day vulnerabilities to bypass perimeter defenses. This research conducts an empirical investigation of exploit kit lifecycles and introduces a structured kill-chain telemetry model for proactive incident detection.",
    doi: "Pending Official Indexing",
    url: "https://www.researchgate.net/profile/Toufique-Gazi",
    keywords: [
      "Exploit Kits",
      "Zero-Day Attacks",
      "Cyber Kill Chain",
      "Threat Telemetry",
      "Network Security",
    ],
  },
  {
    id: "pub-2025-transfer-learning",
    title:
      "Dynamic Multitask Transfer Learning with Adaptive Feature Sharing for Heterogeneous Data and Continual Learning",
    authors: "Toufique Ahammad Gazi, et al.",
    year: "2025",
    type: "Journal / Research Article",
    venue: "Journal of Advanced Artificial Intelligence & Data Science",
    badge: "Machine Learning",
    abstract:
      "Heterogeneous data distributions pose significant obstacles for traditional deep multitask models, frequently causing negative transfer and catastrophic forgetting. We propose an adaptive feature-sharing network architecture with dynamic gating that continuously accommodates non-stationary incoming data streams.",
    doi: "Available on ResearchGate",
    url: "https://www.researchgate.net/profile/Toufique-Gazi",
    keywords: [
      "Transfer Learning",
      "Multitask Learning",
      "Continual Learning",
      "Adaptive Gating",
    ],
  },
  {
    id: "pub-2025-sports-vision",
    title:
      "Real-Time Sports Analysis: A Novel Computer Vision System for Player Movement and Game Situations",
    authors:
      "Kaushik Paul, Ranjan Bannerjee, Debmalya Mukherjee, Toufique Ahammad Gazi",
    year: "2025",
    type: "Journal / Research Article",
    venue: "International Journal of Computer Vision & Sports Engineering",
    badge: "Computer Vision",
    abstract:
      "High-speed multi-agent sports environments demand sub-frame latency and accurate occlusion-resistant trajectory tracking. We introduce an end-to-end computer vision pipeline combining deep feature tracking, homography transformation, and tactical situation classification.",
    doi: "Indexed on ResearchGate",
    url: "https://www.researchgate.net/profile/Toufique-Gazi",
    keywords: [
      "Computer Vision",
      "Object Tracking",
      "Sports Analytics",
      "Homography Mapping",
    ],
  },
  {
    id: "pub-2024-sensor-disease",
    title:
      "Empowering Chronic Disease Self-Management: The Potential of Sensor Data",
    authors: "Toufique Ahammad Gazi, et al.",
    year: "2024",
    type: "Journal / Research Article",
    venue: "Healthcare Informatics & Ambient Sensing Letters",
    badge: "IoT & Healthcare",
    abstract:
      "Investigating wearable biometric sensor data streams for automated anomaly detection in chronic health management, emphasizing edge-computed privacy guarantees and patient data integrity.",
    doi: "Indexed via Academic Databases",
    url: "https://scholar.google.com/",
    keywords: [
      "Sensor Networks",
      "Healthcare IoT",
      "Chronic Disease Monitoring",
      "Edge Computing",
    ],
  },
];

export const INITIAL_BOOK_CHAPTERS: BookChapterItem[] = [
  {
    id: "chapter-igi-cyberdefence",
    title: "A Study on Cyber Defence Curse for Online Attackers",
    bookTitle:
      "Strengthening Industrial Cybersecurity to Protect Business Intelligence",
    authors: "Ranjan Banerjee, Rabindranath Sahu, Toufique Ahammad Gazi",
    publisher: "IGI Global",
    year: "2024",
    isbn: "9781668499252",
    doi: "10.4018/978-1-6684-9925-2",
    url: "https://www.igi-global.com/book/strengthening-industrial-cybersecurity-protect-business/326880",
    abstract:
      "This scholarly book chapter examines the asymmetric battlefield between malicious online attackers and modern enterprise cyber defense systems. It dissects industrial threat surfaces, defensive containment protocols, and architectural safeguards essential for shielding business intelligence infrastructure from stealthy cyber incursions.",
    keywords: [
      "Industrial Cybersecurity",
      "Cyber Defense",
      "Business Intelligence",
      "Threat Containment",
    ],
  },
];

export const INITIAL_CONFERENCES: ConferenceItem[] = [
  {
    id: "conf-cyber-observability",
    title: "Network Observability Paradigms in Modern Cloud-Native Topologies",
    conference:
      "International Conference on Advanced Computing, Communication & Security",
    year: "2024",
    role: "Paper Presenter & Contributor",
    location: "Kolkata, India",
    abstract:
      "Explored real-time eBPF-based kernel observability techniques to detect covert exfiltration channels in Kubernetes clusters with negligible CPU overhead.",
    tags: ["Cloud Security", "eBPF", "Network Observability", "Container Security"],
  },
  {
    id: "conf-iot-security",
    title:
      "Lightweight Cryptographic Handshakes for Resource-Constrained IoT Sensors",
    conference: "National Symposium on Secure Distributed Computing",
    year: "2023",
    role: "Speaker",
    location: "West Bengal, India",
    abstract:
      "Evaluated lightweight elliptic-curve variants tailored for 8-bit and 32-bit microcontroller nodes operating in low-bandwidth wireless sensor networks.",
    tags: ["IoT", "Lightweight Cryptography", "WSN", "Sensor Networks"],
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "threat-killchain-sentinel",
    title: "Cyber Threat Telemetry & Kill-Chain Sentinel",
    subtitle: "Automated Attack Lifecycle Analysis Engine",
    category: "Cybersecurity Research",
    date: "2024 - 2026",
    status: "Active Research Prototype",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    description:
      "An automated threat intelligence framework designed to map dynamic network telemetry to stages of the Cyber Kill Chain, isolating zero-day exploit probes before payload detonation.",
    techStack: [
      "Python",
      "eBPF",
      "Snort/Suricata",
      "Kafka",
      "Elasticsearch",
    ],
    highlights: [
      "Near real-time packet parsing with custom kernel probes",
      "Behavioral correlation graph detecting lateral attacker movement",
      "Modular defense rules with automated firewall orchestration",
    ],
  },
  {
    id: "sports-vision-pipeline",
    title: "SportsVision: Real-Time Multi-Agent Tracking System",
    subtitle: "High-FPS Computer Vision Pipeline",
    category: "Computer Vision & AI",
    date: "2024 - 2025",
    status: "Published Research Implementation",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    description:
      "Computer vision platform for automated player trajectory analysis, pitch homography estimation, and tactical event recognition in competitive sports broadcasts.",
    techStack: ["PyTorch", "OpenCV", "YOLOv8", "DeepSORT", "FastAPI"],
    highlights: [
      "Maintains 45+ FPS real-time tracking on consumer GPU hardware",
      "Robust tracking under severe player-to-player occlusions",
      "Automatic 2D pitch plane homography projection",
    ],
  },
  {
    id: "iot-mesh-guard",
    title: "IoT-MeshGuard: Lightweight Security Protocol",
    subtitle: "Edge Authentication & Telemetry Guard",
    category: "IoT & Distributed Systems",
    date: "2023 - 2024",
    status: "Benchmarked Prototype",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    description:
      "A lightweight mutual authentication and distributed telemetry validation protocol designed specifically for energy-constrained microcontroller clusters.",
    techStack: ["Embedded C", "FreeRTOS", "MQTT-SN", "ChaCha20-Poly1305"],
    highlights: [
      "73% lower cryptographic handshake latency compared to standard TLS 1.3",
      "Minimal memory footprint fitting under 16KB SRAM devices",
      "Resistant to replay and man-in-the-middle impersonation attacks",
    ],
  },
];

export const INITIAL_PATENTS: PatentItem[] = [
  {
    id: "patent-pipeline-template",
    title:
      "Method and System for Automated Threat Telemetry Mapping in Distributed Computing Environments",
    status: "Under Institutional IPR Review / Provisional Stage",
    applicationNumber: "Details pending public gazette publication",
    filingDate: "To be updated upon gazette listing",
    jurisdiction: "Indian Patent Office (IPO)",
    inventors: [
      "Toufique Ahammad Gazi",
      "Co-inventors as per institutional submission",
    ],
    abstract:
      "A novel architectural design for low-overhead kernel telemetry extraction and graph-based threat correlation in cloud networks.",
  },
];

export const INITIAL_COURSES: CourseTaughtItem[] = [
  {
    code: "CSE-401",
    name: "Network Security & Cryptography",
    level: "Undergraduate / B.Tech",
    institution: "Adamas University",
    topics:
      "Symmetric/Asymmetric Ciphers, Protocol Flaws, PKI, Firewalls, Snort IDS, Threat Modeling",
  },
  {
    code: "CSE-302",
    name: "Operating Systems & Kernel Internals",
    level: "Undergraduate / B.Tech",
    institution: "Adamas University",
    topics:
      "Process Synchronization, Virtual Memory, Linux System Calls, POSIX Threads, File Systems",
  },
  {
    code: "CSE-204",
    name: "Data Structures & Algorithms",
    level: "Undergraduate / B.Tech",
    institution: "Adamas University",
    topics:
      "Asymptotic Analysis, Balanced Trees, Graph Algorithms, Dynamic Programming",
  },
  {
    code: "AIML-502",
    name: "Applied Machine Learning & Computer Vision",
    level: "Postgraduate / M.Tech",
    institution: "Adamas University",
    topics:
      "Convolutional Networks, Transfer Learning, Object Detection, Dimensionality Reduction",
  },
];

export const INITIAL_ACTIVITIES: AcademicActivityItem[] = [
  {
    role: "Curriculum & Syllabus Development Committee Member",
    organization:
      "Department of Computer Science & Engineering, Adamas University",
    period: "2023 - Present",
    description:
      "Contributing to the modernization of computing curricula to align with current cybersecurity and AI industry frameworks.",
  },
  {
    role: "Technical Workshop Coordinator",
    organization: "Adamas University & Brainware University",
    period: "2022 - Present",
    description:
      "Organized student workshops on 'Hands-on Penetration Testing & Packet Analysis' and 'Deep Learning with PyTorch'.",
  },
  {
    role: "Peer Reviewer & Technical Session Contributor",
    organization: "International Journals & Academic Conferences",
    period: "2023 - Present",
    description:
      "Providing rigorous peer reviews for manuscripts in cybersecurity, distributed networking, and computer vision.",
  },
  {
    role: "Undergraduate Capstone Project Supervisor",
    organization: "School of Engineering & Technology",
    period: "Ongoing",
    description:
      "Mentoring final-year engineering cohorts on thesis development, paper drafting, and software architecture.",
  },
];

export const INITIAL_LINKS: LinkItem[] = [
  {
    name: "Google Scholar",
    label: "Google Scholar Profile",
    category: "Citations & Indices",
    url: "https://scholar.google.com/citations?user=AUZIYQG9NJrrgK6aU-qaoYO7C6WyU9AUT-VQtm1j0RRq3wuVsbb2QSNFs__4tMYIobfaIcJnqMaAMI6nu55CjVsX9vxeJAGGZoC_PuQiP7VuhpoPTdNbyMqaBxaWS5wwmQ891m72nNfsN5muG814blbBrrzUlg==",
    description: "Verified scholarly index, citation count, and paper impact metrics.",
    icon: "GraduationCap",
  },
  {
    name: "ResearchGate",
    label: "ResearchGate Profile",
    category: "Publications & Preprints",
    url: "https://www.researchgate.net/profile/Toufique-Gazi",
    description:
      "Preprints, full-text articles, project updates, and scientific collaborations.",
    icon: "BookOpen",
  },
  {
    name: "Adamas University Directory",
    label: "Faculty Profile",
    category: "University Directory",
    url: "https://aucse.in",
    description:
      "Official faculty listing at the School of Engineering & Technology (SOET).",
    icon: "Building",
  },
  {
    name: "LinkedIn",
    label: "Professional Network",
    category: "Professional",
    url: "https://www.linkedin.com/in/toufique-ahammad-gazi-124b45155/",
    description:
      "Academic updates, technical talks, student accomplishments, and industry dialogue.",
    icon: "Linkedin",
  },
  {
    name: "GitHub",
    label: "GitHub Repositories",
    category: "Code & Datasets",
    url: "https://github.com/",
    description:
      "Open-source research code, simulation scripts, and course materials.",
    icon: "Github",
  },
  {
    name: "ORCID",
    label: "ORCID Identifier",
    category: "Persistent Academic ID",
    url: "https://orcid.org/",
    description:
      "Unique persistent digital identifier connecting scholarly contributions.",
    icon: "Award",
  },
];
