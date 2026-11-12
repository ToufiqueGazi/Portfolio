"use client";

import { useState, type FC, type FormEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { revealProps } from "@/animations/scroll-animations";
import { CONTACT_EMAIL } from "@/constants/social-constants";
import { FloatingField } from "./floating-field";
import { Check, Copy, Send, Mail } from "lucide-react";
import { useOptionalContent } from "@/lib/content-context";

export const ContactForm: FC = () => {
  const content = useOptionalContent();
  const targetEmail = content?.contact.email || CONTACT_EMAIL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Research Collaboration Inquiry",
    message: "",
  });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${pointerX}% ${pointerY}%, rgba(92,51,204,0.18), transparent 40%)`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subjectLine = encodeURIComponent(`[Academic Portfolio] ${formData.subject} - from ${formData.name}`);
    const bodyContent = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.subject}\n\nMessage:\n${formData.message}\n`
    );
    const mailtoUrl = `mailto:${targetEmail}?subject=${subjectLine}&body=${bodyContent}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const handleCopy = () => {
    const textToCopy = `To: ${targetEmail}\nSubject: [Academic Inquiry] ${formData.subject}\nFrom: ${formData.name} (${formData.email})\n\n${formData.message}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isComplete =
    formData.name.trim() !== "" &&
    emailPattern.test(formData.email.trim()) &&
    formData.message.trim() !== "";

  return (
    <motion.div
      {...revealProps(0.1)}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
      className="glass gradient-border relative overflow-hidden p-7 md:p-10 lg:col-span-7"
    >
      <motion.div
        aria-hidden
        style={{ backgroundImage: glow }}
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">{content?.contact.formEyebrow || "Academic Dispatch"}</p>
          <h3 className="mt-1 text-xl font-bold md:text-2xl text-white">
            {content?.contact.formTitle || "Send a Direct Communication"}
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
          <Mail className="h-3.5 w-3.5 text-aqua" />
          <span>Direct to Faculty Inbox</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatingField
            id="name"
            label="Your Full Name"
            value={formData.name}
            onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
            required
            autoComplete="name"
          />
          <FloatingField
            id="email"
            label="Your Academic / Official Email"
            type="text"
            inputMode="email"
            autoComplete="email"
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
            title="Please enter a valid email address (e.g. user@institution.edu)"
            value={formData.email}
            onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
            required
          />
        </div>

        {/* Inquiry Category */}
        <div className="relative">
          <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
            Nature of Communication
          </label>
          <select
            value={formData.subject}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="w-full rounded-xl border border-white/10 bg-midnight/90 px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-royal/80 transition-colors"
          >
            <option value="Research Collaboration Inquiry">
              Research Collaboration &amp; Joint Proposal
            </option>
            <option value="Student Advising & Capstone Supervision">
              Student Advising &amp; Capstone Project
            </option>
            <option value="Conference Review / Program Committee">
              Conference Review &amp; Program Committee
            </option>
            <option value="Guest Lecture & Invited Talk">
              Guest Lecture &amp; Academic Seminar
            </option>
            <option value="General Academic Query">General Academic Inquiry</option>
          </select>
        </div>

        <FloatingField
          id="message"
          label="Your Message or Proposal Summary"
          value={formData.message}
          onChange={(val) => setFormData((prev) => ({ ...prev, message: val }))}
          required
          textarea
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={!isComplete}
            whileTap={{ scale: 0.98 }}
            className={`btn-primary w-full sm:flex-1 py-3.5 text-sm md:text-base font-semibold ${
              !isComplete ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Launch Email Client</span>
          </motion.button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost w-full sm:w-auto py-3.5 px-4 text-xs md:text-sm flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-mint" />
                <span className="text-mint font-medium">Copied Text &amp; Email</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-neutral-400" />
                <span>Copy Draft &amp; Address</span>
              </>
            )}
          </button>
        </div>

        {submitted && (
          <p className="text-center text-xs text-mint mt-2">
            Email client opened! If your email app did not launch, click &quot;Copy Draft &amp; Address&quot; to send manually to {CONTACT_EMAIL}.
          </p>
        )}
      </form>
    </motion.div>
  );
};
