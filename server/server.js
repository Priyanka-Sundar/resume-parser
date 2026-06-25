/**
 * server.js
 * -----------------------------------------------------------------------------
 * Express backend for the Resume Parser.
 *
 * Responsibilities:
 *   - Serve the API at POST /api/parse
 *   - Accept a single file upload via multer (in-memory storage)
 *   - Delegate text extraction + parsing to parser.js
 *   - Return a clean JSON object the React frontend can render
 *
 * Run:  node server.js     (default port 5000)
 * -----------------------------------------------------------------------------
 */

import express from "express";
import cors from "cors";
import multer from "multer";
import { parseResumeFile } from "./parser.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/*  Middleware                                                                */
/* -------------------------------------------------------------------------- */

// Allow the Vite dev server (http://localhost:5173) to call this API
app.use(cors());

// Parse JSON bodies (small ones, e.g. health checks)
app.use(express.json());

// Multer: store the uploaded file in memory (no disk writes)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf",
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                     "application/msword"];
    const ext = (file.originalname || "").toLowerCase().split(".").pop();
    if (allowed.includes(file.mimetype) || ["pdf", "doc", "docx"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc and .docx files are supported."));
    }
  },
});

/* -------------------------------------------------------------------------- */
/*  Routes                                                                    */
/* -------------------------------------------------------------------------- */

// Health check — useful to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "resume-parser", time: new Date().toISOString() });
});

// Main parsing endpoint
// Usage:  POST /api/parse   with multipart/form-data field "resume"
app.post("/api/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use field name 'resume'." });
    }
    console.log(`[parser] Received: ${req.file.originalname} (${req.file.size} bytes)`);

    const result = await parseResumeFile(req.file);
    console.log(`[parser] Done. Skills found: ${result.skills.length}, Experience entries: ${result.experience.length}`);

    res.json(result);
  } catch (err) {
    console.error("[parser] Error:", err.message);
    res.status(500).json({ error: err.message || "Failed to parse resume." });
  }
});

// Global error handler (e.g. multer fileFilter rejections)
app.use((err, req, res, next) => {
  console.error("[server] Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

/* -------------------------------------------------------------------------- */
/*  Start                                                                     */
/* -------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log("\n─────────────────────────────────────────────");
  console.log(`  Resume Parser API running`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → POST /api/parse  (multipart field: "resume")`);
  console.log("─────────────────────────────────────────────\n");
});
