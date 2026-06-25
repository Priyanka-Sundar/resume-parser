import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileScan } from "lucide-react";

/**
 * Header
 * -----------------------------------------------------------------------------
 * A premium header with a subtle parallax / magnetic effect on scroll:
 *   - The whole bar translates upward and fades as the user scrolls down.
 *   - The logo has a gentle floating animation.
 *   - A gradient progress bar at the bottom of the header tracks scroll depth.
 */
export default function Header() {
  const { scrollY } = useScroll();
  const headerRef = useRef(null);

  // Parallax: as the user scrolls down, push the header up slightly & fade
  const y = useTransform(scrollY, [0, 220], [0, -28]);
  const opacity = useTransform(scrollY, [0, 220], [1, 0.55]);
  // Top progress bar width = scroll progress (0 → 1)
  const progressScaleX = useTransform(scrollY, [0, 1], [0, 1]);

  return (
    <motion.header
      ref={headerRef}
      style={{ y, opacity }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="glass border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="group flex items-center gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-electric shadow-glow"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileScan size={20} className="text-ink-950" strokeWidth={2.4} />
                <span className="absolute inset-0 rounded-xl ring-2 ring-accent/40 animate-pulse-glow" />
              </motion.span>
              <div className="leading-tight">
                <div className="font-display text-lg sm:text-xl font-bold tracking-tight">
                  Resume<span className="text-gradient">Parser</span>
                </div>
                <div className="text-[10px] sm:text-xs text-ink-400 font-mono">
                  AI · Regex Engine
                </div>
              </div>
            </motion.a>

            {/* Right nav */}
            <nav className="hidden sm:flex items-center gap-6 text-sm">
              <a href="#" className="text-ink-300 hover:text-ink-100 transition-colors">
                Home
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink-300 hover:text-ink-100 transition-colors"
              >
                GitHub
              </a>
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                Online
              </span>
            </nav>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          style={{ scaleX: progressScaleX, transformOrigin: "0% 50%" }}
          className="h-px bg-gradient-to-r from-accent via-electric to-coral"
        />
      </div>
    </motion.header>
  );
}
