import { type Transition } from "motion/react";
import { type Project } from "@/types/portfolio-types";

export const MY_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Cyber Threat Telemetry & Kill-Chain Sentinel",
    category: "Cybersecurity Research Prototype",
    description:
      "Automated threat intelligence and kernel telemetry framework mapping real-time attack flows to the Cyber Kill Chain.",
    subDescription: [
      "Designed eBPF-driven kernel probes for non-intrusive syscall tracing under adversarial simulation.",
      "Mapped telemetry stages to MITRE ATT&CK tactics to detect covert zero-day payloads.",
      "Engineered automated firewall rule synthesis for rapid threat containment.",
      "Repository will be open-sourced following formal conference publication.",
    ],
    href: "https://www.researchgate.net/profile/Toufique-Gazi",
    logo: "",
    image: "",
    accent: "from-aqua/40 to-royal/10",
    tags: [
      { id: 1, name: "Python", path: "/assets/logos/javascript.svg" },
      { id: 2, name: "eBPF", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "Suricata", path: "/assets/logos/javascript.svg" },
      { id: 4, name: "Elastic", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 2,
    title: "SportsVision: Real-Time Multi-Agent Tracking",
    category: "Computer Vision & AI",
    description:
      "High-FPS deep learning computer vision pipeline for real-time player tracking, homography mapping, and tactical situation analysis.",
    subDescription: [
      "Engineered a dual-stream YOLOv8 + DeepSORT tracker maintaining 45+ FPS on edge GPUs.",
      "Implemented automated 2D pitch planar homography projection for tactical velocity mapping.",
      "Evaluated against occluded competitive sports footage with state-of-the-art MOTA scores.",
      "Published in peer-reviewed scientific proceedings (Paul, Bannerjee, Mukherjee, Gazi, 2025).",
    ],
    href: "https://www.researchgate.net/profile/Toufique-Gazi",
    logo: "",
    image: "",
    accent: "from-royal/40 to-lavender/10",
    tags: [
      { id: 1, name: "PyTorch", path: "/assets/logos/react.svg" },
      { id: 2, name: "OpenCV", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "YOLOv8", path: "/assets/logos/javascript.svg" },
      { id: 4, name: "FastAPI", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 3,
    title: "IoT-MeshGuard: Lightweight Security Protocol",
    category: "IoT & Distributed Systems",
    description:
      "Lightweight mutual authentication and distributed telemetry validation protocol designed for energy-constrained microcontrollers.",
    subDescription: [
      "Formulated lightweight cryptographic handshakes achieving 73% lower latency than TLS 1.3.",
      "Designed for 16KB SRAM footprint on ARM Cortex-M microcontrollers.",
      "Formally verified against replay and man-in-the-middle impersonation attacks.",
      "Integrated with MQTT-SN edge brokers for smart sensor telemetry.",
    ],
    href: "https://www.researchgate.net/profile/Toufique-Gazi",
    logo: "",
    image: "",
    accent: "from-fuchsia/40 to-royal/10",
    tags: [
      { id: 1, name: "Embedded C", path: "/assets/logos/javascript.svg" },
      { id: 2, name: "FreeRTOS", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "MQTT-SN", path: "/assets/logos/javascript.svg" },
      { id: 4, name: "Crypto", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 4,
    title: "Dynamic Multitask Transfer Learning Engine",
    category: "Deep Learning Research",
    description:
      "Adaptive feature-sharing neural architecture preventing negative transfer in heterogeneous data environments.",
    subDescription: [
      "Introduced continuous dynamic gating mechanisms for non-stationary incoming data streams.",
      "Mitigated catastrophic forgetting across sequential multimodal tasks.",
      "Validated across multimodal recommendation and anomaly classification benchmarks.",
      "Scholarly publication under indexed dissemination (2025).",
    ],
    href: "https://www.researchgate.net/profile/Toufique-Gazi",
    logo: "",
    image: "",
    accent: "from-sand/40 to-coral/10",
    tags: [
      { id: 1, name: "PyTorch", path: "/assets/logos/react.svg" },
      { id: 2, name: "Python", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "Transfer ML", path: "/assets/logos/javascript.svg" },
      { id: 4, name: "Multimodal", path: "/assets/logos/javascript.svg" },
    ],
  },
];

export const TILT_SPRING: Transition = { stiffness: 200, damping: 18 };

export const TILT_RANGE: { x: [number, number]; y: [number, number] } = {
  x: [10, -10],
  y: [-14, 14],
};

export const TRACK_SPRING: Transition = { stiffness: 60, damping: 20 };

export const PREVIEW_WINDOW = 1;
