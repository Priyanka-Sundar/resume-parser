import { motion } from "framer-motion";
import { Cpu, Sparkle } from "lucide-react";

/**
 * SkillsCard
 * -----------------------------------------------------------------------------
 * Renders the extracted skills as a wrap of pill chips that pop in one-by-one
 * with a springy stagger. If no skills were found, shows an empty state.
 */
export default function SkillsCard({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <Cpu size={28} className="text-ink-500 mb-3" />
        <p className="text-sm text-ink-400">No skills detected.</p>
        <p className="text-xs text-ink-500 mt-1">
          Try a resume with a clearer skills section.
        </p>
      </div>
    );
  }

  // Group skills into 3 columns visually using a CSS column layout
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-wider text-ink-400">
          Detected skills
        </span>
        <span className="chip">
          <Sparkle size={11} className="text-electric" />
          {skills.length} found
        </span>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        className="flex flex-wrap gap-2"
      >
        {skills.map((skill) => (
          <motion.span
            key={skill}
            variants={{
              hidden: { opacity: 0, scale: 0.4, y: 8 },
              show:   { opacity: 1, scale: 1,   y: 0, transition: { type: "spring", stiffness: 400, damping: 18 } },
            }}
            whileHover={{ scale: 1.08, y: -2 }}
            className="cursor-default px-3 py-1.5 rounded-xl text-sm font-medium
                       bg-gradient-to-br from-white/[0.07] to-white/[0.02]
                       border border-white/10 text-ink-100
                       hover:border-electric/50 hover:from-electric/15 hover:to-accent/10
                       transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
