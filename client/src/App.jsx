import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, AlertTriangle, RotateCcw } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

import Header from "./components/Header.jsx";
import FileUpload from "./components/FileUpload.jsx";
import ParseButton from "./components/ParseButton.jsx";
import Loader from "./components/Loader.jsx";
import ResultsGrid from "./components/ResultsGrid.jsx";
import BackgroundFx from "./components/BackgroundFx.jsx";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */

  const handleFileSelected = useCallback((selected) => {
    setFile(selected);
    setResult(null);
    setError("");
  }, []);

  const handleParse = useCallback(async () => {
    if (!file) {
      setError("Please upload a resume file first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const resp = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to parse resume.");

      setResult(data);
      // Smooth-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError("");
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <div className="relative min-h-screen">
      <BackgroundFx />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          {/* ---------------- Hero / Upload area ---------------- */}
          <section className="pt-6 sm:pt-10 lg:pt-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="chip mb-5">
                <Sparkles size={14} className="text-accent-glow" />
                AI-Powered · Regex &amp; Keyword Engine
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Parse any resume into
                <br />
                <span className="text-gradient">structured candidate data</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-ink-300 max-w-2xl mx-auto">
                Upload a <span className="text-ink-100 font-medium">.pdf</span>,{" "}
                <span className="text-ink-100 font-medium">.doc</span>, or{" "}
                <span className="text-ink-100 font-medium">.docx</span> resume. Our parser extracts
                personal info, skills, experience, and education — then renders it in a beautiful,
                animated card layout.
              </p>
            </motion.div>

            {/* Upload zone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 sm:mt-12"
            >
              <FileUpload file={file} onFileSelected={handleFileSelected} />
            </motion.div>

            {/* Parse button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <ParseButton onClick={handleParse} disabled={!file || loading} loading={loading} />

              {file && !loading && (
                <button
                  onClick={handleReset}
                  className="text-sm text-ink-400 hover:text-ink-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 mx-auto max-w-xl flex items-start gap-3 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral"
                >
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ---------------- Loader ---------------- */}
          <AnimatePresence>
            {loading && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-16"
              >
                <Loader />
              </motion.section>
            )}
          </AnimatePresence>

          {/* ---------------- Results ---------------- */}
          <AnimatePresence>
            {result && !loading && (
              <motion.section
                ref={resultsRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-16 scroll-mt-6"
              >
                <ResultsGrid data={result} />
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* ---------------- Footer ---------------- */}
        <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-ink-500">
          <p>
            Built with React · Vite · Tailwind · Framer Motion · Express
          </p>
          <p className="mt-1">Resume Parser · {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* Vercel Analytics - placed at the end of the component */}
      <Analytics />
    </div>
  );
}