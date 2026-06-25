import { motion } from "framer-motion";
import { GraduationCap, School, CalendarDays, Award } from "lucide-react";

/**
 * EducationCard
 * -----------------------------------------------------------------------------
 * Renders a list of education entries (degree, institution, year, details)
 * with a stagger reveal.
 */
export default function EducationCard({ education }) {
  if (!education || education.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <GraduationCap size={28} className="text-ink-500 mb-3" />
        <p className="text-sm text-ink-400">No education entries detected.</p>
        <p className="text-xs text-ink-500 mt-1">
          The parser couldn't identify a clear education section.
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.15 } } }}
      className="space-y-4"
    >
      {education.map((edu, i) => (
        <motion.li
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18 },
            show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
          }}
          className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 hover:border-mint/40 hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-mint/30 to-electric/20 border border-white/10 shrink-0">
              <Award size={16} className="text-mint" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-semibold text-ink-100 leading-tight">
                {edu.degree || "Degree"}
              </h4>

              {edu.institution && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-300">
                  <School size={13} className="text-mint" />
                  {edu.institution}
                </div>
              )}

              {edu.year && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                  <CalendarDays size={11} className="text-mint" />
                  {edu.year}
                </div>
              )}

              {edu.details && (
                <p className="mt-2 text-sm text-ink-300 leading-relaxed line-clamp-3">
                  {edu.details}
                </p>
              )}
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
