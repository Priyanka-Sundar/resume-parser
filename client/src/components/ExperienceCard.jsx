import { motion } from "framer-motion";
import { Briefcase, Building2, CalendarDays, ChevronRight } from "lucide-react";

/**
 * ExperienceCard
 * -----------------------------------------------------------------------------
 * Renders a timeline of work-experience entries. Each entry slides in from the
 * left with a vertical accent line connecting them.
 */
export default function ExperienceCard({ experience }) {
  if (!experience || experience.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Briefcase size={28} className="text-ink-500 mb-3" />
        <p className="text-sm text-ink-400">No experience entries detected.</p>
        <p className="text-xs text-ink-500 mt-1">
          The parser couldn't identify a clear experience section.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-coral/60 via-accent/40 to-transparent" />

      <motion.ol
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="space-y-5"
      >
        {experience.map((job, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -20 },
              show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
            }}
            className="relative pl-12"
          >
            {/* Dot */}
            <span className="absolute left-[10px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-coral to-accent ring-4 ring-ink-950" />

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 hover:border-coral/40 hover:bg-white/[0.04] transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-ink-100 leading-tight">
                    {job.role || "Role"}
                  </h4>
                  {job.company && (
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-300">
                      <Building2 size={13} className="text-coral" />
                      {job.company}
                    </div>
                  )}
                </div>
                {job.duration && (
                  <span className="chip text-[11px]">
                    <CalendarDays size={11} className="text-coral" />
                    {job.duration}
                  </span>
                )}
              </div>

              {job.description && (
                <p className="mt-3 text-sm text-ink-300 leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
