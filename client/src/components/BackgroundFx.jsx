import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * BackgroundFx
 * -----------------------------------------------------------------------------
 * A purely decorative animated background:
 *   - A few floating blurred orbs that drift slowly.
 *   - A subtle dotted grid overlay.
 * Behind everything (z-0), so all content sits on top.
 */
export default function BackgroundFx() {
  // Stable random positions per render
  const orbs = useMemo(
    () => [
      { size: 320, top: "-5%",  left: "-10%", color: "rgba(167,139,250,0.30)", duration: 18 },
      { size: 280, top: "30%",  left: "70%",  color: "rgba(34,211,238,0.25)",  duration: 22 },
      { size: 360, top: "70%",  left: "10%",  color: "rgba(251,113,133,0.20)", duration: 26 },
      { size: 240, top: "85%",  left: "80%",  color: "rgba(52,211,153,0.18)",  duration: 20 },
    ],
    []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/80" />
    </div>
  );
}
