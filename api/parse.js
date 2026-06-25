import multer from "multer";
import { parseResumeFile } from "../server/parser.js";

// Disable Next.js/Vercel default body parsing — multer needs the raw stream
export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = (file.originalname || "").toLowerCase().split(".").pop();
    if (["pdf", "doc", "docx"].includes(ext)) cb(null, true);
    else cb(new Error("Only .pdf, .doc, .docx files are supported."));
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }
  try {
    await new Promise((resolve, reject) => {
      upload.single("resume")(req, res, (err) => err ? reject(err) : resolve());
    });
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const result = await parseResumeFile(req.file);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to parse resume." });
  }
}