import { motion } from "framer-motion";
import { User, Cpu, Briefcase, GraduationCap } from "lucide-react";

import PersonalInfoCard from "./PersonalInfoCard.jsx";
import SkillsCard from "./SkillsCard.jsx";
import ExperienceCard from "./ExperienceCard.jsx";
import EducationCard from "./EducationCard.jsx";
import TypewriterText from "./TypewriterText.jsx";

/**
 * ResultsGrid
 * -----------------------------------------------------------------------------
 * Renders the parsed resume as a responsive grid of cards. Each card "falls"
 * into place with a stagger effect. The header title types itself out.
 *
 * Layout:
 *   - Row 1: PersonalInfo (spans 2 cols on lg) | Skills (1 col)
 *   - Row 2: Experience (spans 2 cols on lg) | Education (1 col)
 */
const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 60, rotateX: -8 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

export default function ResultsGrid({ data }) {
  return (
    <div className="perspective">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <span className="chip mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-mint" /> Parse complete
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          <TypewriterText
            text="Candidate profile extracted"
            speed={28}
            className="text-gradient"
          />
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          Source: <span className="font-mono text-ink-200">{data.meta?.fileName || "resume"}</span>{" "}
          · Parsed at {new Date(data.meta?.parsedAt || Date.now()).toLocaleTimeString()}
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {/* Row 1 */}
        <motion.div variants={CARD_VARIANTS} className="lg:col-span-2">
          <CardShell icon={<User size={18} />} title="Personal Information" accent="accent">
            <PersonalInfoCard info={data.personalInfo} />
          </CardShell>
        </motion.div>

        <motion.div variants={CARD_VARIANTS}>
          <CardShell icon={<Cpu size={18} />} title="Skills" accent="electric">
            <SkillsCard skills={data.skills} />
          </CardShell>
        </motion.div>

        {/* Row 2 */}
        <motion.div variants={CARD_VARIANTS} className="lg:col-span-2">
          <CardShell icon={<Briefcase size={18} />} title="Experience" accent="coral">
            <ExperienceCard experience={data.experience} />
          </CardShell>
        </motion.div>

        <motion.div variants={CARD_VARIANTS}>
          <CardShell icon={<GraduationCap size={18} />} title="Education" accent="mint">
            <EducationCard education={data.education} />
          </CardShell>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card shell (shared chrome)                                                */
/* -------------------------------------------------------------------------- */

const ACCENT_RING = {
  accent:   "from-accent/40 to-accent/0",
  electric: "from-electric/40 to-electric/0",
  coral:    "from-coral/40 to-coral/0",
  mint:     "from-mint/40 to-mint/0",
};

function CardShell({ icon, title, accent = "accent", children }) {
  return (
    <div className="group relative h-full">
      <div className="relative h-full glass rounded-3xl overflow-hidden gradient-border transition-all duration-500 hover:shadow-card hover:-translate-y-0.5">
        {/* Top accent bar */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${ACCENT_RING[accent]}`} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
          <div
            className={`grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br ${
              ACCENT_RING[accent]
            } border border-white/10 text-ink-100`}
          >
            {icon}
          </div>
          <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
