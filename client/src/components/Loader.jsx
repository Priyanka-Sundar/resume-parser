import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  "Uploading file to secure parser…",
  "Extracting text from document…",
  "Identifying candidate sections…",
  "Matching skills against dictionary…",
  "Structuring experience entries…",
  "Compiling final JSON output…",
];

/**
 * Loader
 * -----------------------------------------------------------------------------
 * A premium multi-stage loader:
 *   - Animated rings
 *   - A cycling status message that "types" out
 *   - A shimmer progress bar
 */
export default function Loader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-xl glass rounded-3xl px-6 py-10 text-center"
    >
      {/* Animated rings */}
      <div className="relative mx-auto mb-6 w-20 h-20">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-electric/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-accent to-electric grid place-items-center shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-3 h-3 rounded-full bg-ink-950" />
        </motion.div>
      </div>

      {/* Status message */}
      <motion.p
        key={stepIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm sm:text-base text-ink-200 font-mono"
      >
        {STEPS[stepIndex]}
      </motion.p>

      {/* Shimmer progress bar */}
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-electric to-coral"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
