import { type Service } from "@/types/portfolio-types";

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Cyber Threat Intelligence & Defense",
    description:
      "Empirical analysis of modern exploit kits, zero-day threat containment, and automated Cyber Kill Chain telemetry.",
    icon: "/assets/react.svg",
    bullets: [
      "Exploit kit telemetry and attack surface minimization",
      "Cyber kill chain phase disruption and real-time incident mitigation",
      "Autonomous host and network anomaly detection",
    ],
  },
  {
    id: 2,
    title: "Cloud & IoT Security Observability",
    description:
      "Lightweight cryptographic handshakes, secure protocol wrappers, and kernel observability for distributed edge and cloud nodes.",
    icon: "/assets/react.svg",
    bullets: [
      "Lightweight mutual authentication for smart sensors",
      "Network telemetry and observability under adversarial load",
      "Microsegmentation and zero-trust cloud network architecture",
    ],
  },
  {
    id: 3,
    title: "Computer Vision & Sports Analytics",
    description:
      "High-frame-rate spatio-temporal computer vision architectures for real-time tracking, homography mapping, and tactical analysis.",
    icon: "/assets/react.svg",
    bullets: [
      "Real-time multi-agent player tracking and pose estimation",
      "Low-latency inference on edge GPU hardware",
      "Adaptive convolutional and transformer vision backbones",
    ],
  },
  {
    id: 4,
    title: "Academic Pedagogy & Research Mentorship",
    description:
      "University-level instruction in Operating Systems, Network Security, and Algorithms with hands-on laboratory modules.",
    icon: "/assets/react.svg",
    bullets: [
      "Interactive laboratory curricula with packet inspection and kernel probes",
      "Supervision of undergraduate and postgraduate capstone theses",
      "Mentoring research papers for publication in indexed venues",
    ],
  },
];
