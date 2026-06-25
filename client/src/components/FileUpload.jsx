import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";

/**
 * FileUpload
 * -----------------------------------------------------------------------------
 * A premium drag-and-drop upload zone with:
 *   - Hover and active ("file being dragged over") states
 *   - A pulse / expand animation when a file is dropped
 *   - A file preview chip with a remove button
 *   - Click-to-browse fallback (for mobile)
 *
 * Accepts: .pdf, .doc, .docx
 */
const ACCEPTED = [".pdf", ".doc", ".docx"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isAccepted(file) {
  const name = (file.name || "").toLowerCase();
  const ext = "." + (name.split(".").pop() || "");
  return ACCEPTED.includes(ext) || ACCEPTED_MIME.includes(file.type);
}

export default function FileUpload({ file, onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      setLocalError("");
      if (!files || !files.length) return;
      const f = files[0];
      if (!isAccepted(f)) {
        setLocalError("Unsupported file type. Please upload a .pdf, .doc, or .docx file.");
        return;
      }
      onFileSelected(f);
      // Trigger the drop-pulse animation
      setJustDropped(true);
      setTimeout(() => setJustDropped(false), 700);
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onBrowseClick = () => inputRef.current?.click();

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <motion.div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onBrowseClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onBrowseClick()}
        className={`
          relative cursor-pointer rounded-3xl border-2 border-dashed
          transition-all duration-300
          ${isDragging
            ? "border-accent bg-accent/10 scale-[1.01]"
            : "border-white/15 hover:border-accent/60 hover:bg-white/[0.04]"}
        `}
        animate={
          justDropped
            ? { scale: [1, 1.03, 1], boxShadow: ["0 0 0 0 rgba(167,139,250,0.55)", "0 0 80px 0 rgba(167,139,250,0.35)", "0 0 0 0 rgba(167,139,250,0)"] }
            : {}
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glow when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-px rounded-3xl pointer-events-none"
              style={{ boxShadow: "0 0 60px -5px rgba(167,139,250,0.55) inset" }}
            />
          )}
        </AnimatePresence>

        <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
          {/* Icon */}
          <motion.div
            className="mx-auto mb-5 grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
                       bg-gradient-to-br from-accent/25 to-electric/25 border border-white/10"
            animate={
              isDragging
                ? { y: [0, -6, 0], scale: 1.1 }
                : justDropped
                ? { scale: [1, 1.25, 1] }
                : { y: [0, -4, 0] }
            }
            transition={
              isDragging
                ? { duration: 0.6, repeat: Infinity }
                : justDropped
                ? { duration: 0.5 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <UploadCloud
              size={32}
              className={isDragging ? "text-accent-glow" : "text-ink-200"}
              strokeWidth={1.8}
            />
          </motion.div>

          <p className="font-display text-lg sm:text-xl font-semibold text-ink-100">
            {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="mt-1.5 text-sm text-ink-400">
            or <span className="text-accent-glow underline underline-offset-2">browse files</span>{" "}
            from your computer
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {ACCEPTED.map((ext) => (
              <span key={ext} className="chip font-mono text-[10px] uppercase tracking-wider">
                {ext}
              </span>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </motion.div>

      {/* Local error (file type) */}
      <AnimatePresence>
        {localError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 text-sm text-coral text-center"
          >
            {localError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Selected file preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="mt-5 mx-auto max-w-xl"
          >
            <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-electric/30 border border-white/10">
                <FileText size={18} className="text-accent-glow" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink-100 truncate">{file.name}</div>
                <div className="text-xs text-ink-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-mint" />
                  {formatBytes(file.size)} · Ready to parse
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelected(null);
                  setLocalError("");
                }}
                className="grid place-items-center w-8 h-8 rounded-lg text-ink-400 hover:text-coral hover:bg-coral/10 transition-colors"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
