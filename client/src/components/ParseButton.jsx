import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

/**
 * ParseButton
 * -----------------------------------------------------------------------------
 * The primary CTA. While loading it shows a spinner + label change. Has a
 * subtle gradient sheen sweep on hover.
 */
export default function ParseButton({ onClick, disabled, loading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      className="btn-primary group relative overflow-hidden"
    >
      {/* Sheen sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Parsing…</span>
        </>
      ) : (
        <>
          <Sparkles size={18} />
          <span>Parse Resume</span>
        </>
      )}
    </motion.button>
  );
}
