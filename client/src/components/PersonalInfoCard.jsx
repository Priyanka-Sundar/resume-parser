import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Globe, User, FileText } from "lucide-react";
import TypewriterText from "./TypewriterText.jsx";

/**
 * PersonalInfoCard
 * -----------------------------------------------------------------------------
 * Displays the candidate's contact info with typewriter effect on the name.
 */
export default function PersonalInfoCard({ info }) {
  const { name, email, phone, links, summary } = info || {};

  const rows = [
    { icon: Mail,     label: "Email",    value: email,   href: email ? `mailto:${email}` : null },
    { icon: Phone,    label: "Phone",    value: phone,   href: phone ? `tel:${phone.replace(/\s/g, "")}` : null },
    { icon: Linkedin, label: "LinkedIn", value: links?.linkedin, href: links?.linkedin, external: true },
    { icon: Github,   label: "GitHub",   value: links?.github,   href: links?.github,   external: true },
    { icon: Globe,    label: "Portfolio",value: links?.portfolio,href: links?.portfolio,external: true },
  ].filter((r) => r.value);

  return (
    <div>
      {/* Name */}
      <div className="flex items-start gap-3 mb-5">
        <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-electric shadow-glow shrink-0">
          <User size={22} className="text-ink-950" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-ink-400">Candidate</div>
          <div className="font-display text-2xl font-bold leading-tight">
            <TypewriterText text={name || "Unknown Candidate"} speed={36} />
          </div>
        </div>
      </div>

      {/* Contact rows */}
      <div className="space-y-2.5">
        {rows.length === 0 && (
          <p className="text-sm text-ink-400 italic">No contact details detected.</p>
        )}
        {rows.map(({ icon: Icon, label, value, href, external }, i) => (
          <motion.a
            key={label}
            href={href || "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="group flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="grid place-items-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/50 transition-colors">
              <Icon size={14} className="text-ink-300 group-hover:text-accent-glow transition-colors" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-ink-500">{label}</div>
              <div className="text-sm text-ink-100 truncate">{value}</div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-ink-400">
            <FileText size={12} /> Summary
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-ink-300 leading-relaxed line-clamp-6"
          >
            {summary}
          </motion.p>
        </div>
      )}
    </div>
  );
}
