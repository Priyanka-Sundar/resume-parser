/**
 * parser.js
 * -----------------------------------------------------------------------------
 * The "AI" parsing layer of the Resume Parser.
 *
 * Since we cannot use external paid APIs (OpenAI / Google Vision / etc.) without
 * API keys, we simulate an intelligent extraction layer using:
 *   - Heuristics        (regex patterns for email / phone)
 *   - Keyword mapping   (skills dictionary)
 *   - Section detection (splitting the resume into Experience / Education
 *                        blocks based on common section headers)
 *
 * The output is a clean, structured JSON object that the frontend renders.
 * -----------------------------------------------------------------------------
 */

import * as pdfParseModule from "pdf-parse";
import mammoth from "mammoth";

/**
 * pdf-parse v1.1.2 exports a default function: `pdfParse(buffer) -> Promise<{text}>`.
 * Newer v2.x exports a `PDFParse` class instead. We support both so the project
 * doesn't break if a user accidentally installs a newer version.
 */
async function extractTextFromPdf(buffer) {
  try {
    // v1.x API: default function export
    if (typeof pdfParseModule.default === "function") {
      const data = await pdfParseModule.default(buffer);
      return data.text || "";
    }
    // v2.x API: PDFParse class with a .parse() / .getText() method
    if (typeof pdfParseModule.PDFParse === "function") {
      const instance = new pdfParseModule.PDFParse(buffer);
      const data = await (instance.parse ? instance.parse() : instance.getText());
      return data.text || "";
    }
    throw new Error("Unsupported pdf-parse API version.");
  } catch (err) {
    console.error("PDF parse error:", err.message);
    throw new Error("Could not read the PDF file. It may be corrupted or scanned.");
  }
}

/**
 * Extract plain text from a DOCX file buffer using mammoth.
 * @param {Buffer|ArrayBuffer} buffer
 * @returns {Promise<string>}
 */
export async function extractTextFromDocx(buffer) {
  try {
    // mammoth v1.x accepts { buffer } in Node.js (Buffer) and { arrayBuffer }
    // in the browser (ArrayBuffer). We detect which one we have and pass the
    // right option to mammoth.
    let result;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(buffer)) {
      result = await mammoth.extractRawText({ buffer });
    } else {
      result = await mammoth.extractRawText({ arrayBuffer: buffer });
    }
    return result.value || "";
  } catch (err) {
    console.error("DOCX parse error:", err.message);
    throw new Error("Could not read the DOCX file. It may be corrupted.");
  }
}

/**
 * Dispatcher: route to the correct extractor based on file extension.
 */
export async function extractText(file) {
  const ext = (file.originalname || "").toLowerCase().split(".").pop();
  if (ext === "pdf") return extractTextFromPdf(file.buffer);
  if (ext === "docx" || ext === "doc") return extractTextFromDocx(file.buffer);
  throw new Error(`Unsupported file type: .${ext}`);
}

/* -------------------------------------------------------------------------- */
/*  2. SKILL DICTIONARY                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A broad dictionary of known skills. We match case-insensitively but preserve
 * the canonical casing for display.
 */
const SKILL_DICTIONARY = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Golang",
  "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart",
  "SQL", "HTML", "CSS", "Bash", "Shell", "Objective-C", "Elixir", "Haskell", "Lua",

  // Frontend
  "React", "React.js", "Redux", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular",
  "Svelte", "SvelteKit", "jQuery", "Bootstrap", "Tailwind CSS", "Material UI",
  "Chakra UI", "Sass", "SCSS", "LESS", "Webpack", "Vite", "Rollup", "Storybook",

  // Backend
  "Node.js", "Express", "Express.js", "NestJS", "Deno", "Fastify", "Koa",
  "Django", "Flask", "FastAPI", "Spring", "Spring Boot", "Hibernate", "Laravel",
  "Symfony", "Ruby on Rails", "ASP.NET", ".NET", "ASP.NET Core", "GraphQL",
  "REST", "gRPC", "WebSocket", "Microservices",

  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server",
  "MariaDB", "Cassandra", "DynamoDB", "Elasticsearch", "Firebase", "Supabase",
  "Prisma", "Sequelize", "TypeORM", "Mongoose", "Neo4j",

  // Cloud / DevOps
  "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform",
  "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Vagrant",
  "Nginx", "Apache", "Linux", "Unix", "Bash", "DevOps", "CI/CD", "Serverless",
  "Lambda", "EC2", "S3", "CloudFront", "CloudFormation",

  // Mobile
  "React Native", "Flutter", "Android", "iOS", "Xamarin", "Ionic",

  // Tools
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Slack", "Figma",
  "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Postman", "Insomnia",

  // Data / AI
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
  "scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
  "Jupyter", "Data Analysis", "Data Science", "NLP", "Computer Vision",
  "OpenCV", "Hadoop", "Spark", "Kafka", "Airflow", "Tableau", "Power BI",
  "Snowflake", "dbt", "Databricks",

  // Soft / Process
  "Agile", "Scrum", "Kanban", "TDD", "BDD", "OOP", "System Design",
  "Leadership", "Communication", "Problem Solving",
];

/* -------------------------------------------------------------------------- */
/*  3. INDIVIDUAL EXTRACTORS                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Extract the candidate's name.
 * Strategy:
 *   1. Look for an explicit "Name:" label.
 *   2. Otherwise, take the first non-empty line of the resume that looks like a
 *      person's name (2-4 capitalized words, no digits, no @).
 */
function extractName(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Strategy 1: explicit label
  const labelMatch = text.match(/(?:^|\n)\s*(?:Name|Full Name|Candidate Name)\s*[:\-]\s*([A-Z][a-zA-Z'.\-]+(?:\s+[A-Z][a-zA-Z'.\-]+){1,3})/);
  if (labelMatch) return labelMatch[1].trim();

  // Strategy 2: first plausible line
  for (const line of lines.slice(0, 8)) {
    if (/[@\d]/.test(line)) continue;                       // skip lines with digits or emails
    if (/(resume|curriculum|cv|profile)/i.test(line)) continue;
    const wordCount = line.split(/\s+/).length;
    if (wordCount >= 2 && wordCount <= 4 && /^[A-Z][a-zA-Z'.\-]+(?:\s+[A-Z][a-zA-Z'.\-]+){1,3}$/.test(line)) {
      return line;
    }
  }
  // Fallback: just return the very first non-empty line
  return lines[0] || "Unknown Candidate";
}

/**
 * Extract email address using a robust regex.
 */
function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}

/**
 * Extract a phone number (supports +country-code, dashes, dots, spaces, parens).
 */
function extractPhone(text) {
  // Strip whitespace around potential phone numbers for better matching
  const patterns = [
    /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/,
    /(\+\d{1,3}[-.\s]?)?\d{5,6}[-.\s]?\d{5,6}/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return "";
}

/**
 * Extract LinkedIn & GitHub URLs (bonus info for Personal Info card).
 */
function extractLinks(text) {
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,)]+/i);
  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,)]+/i);
  // Portfolio: any URL that isn't linkedin/github/facebook/twitter/instagram.
  // Require it to start with http(s):// to avoid false positives from random
  // domain-like substrings (e.g. "ithub.com" inside "github.com").
  const portfolio = text.match(
    /https?:\/\/(?!.*(?:linkedin|github|facebook|twitter|instagram))[a-z0-9.\-]+\.[a-z]{2,}(?:\/[^\s,)]*)?/i
  );
  return {
    linkedin: linkedin ? linkedin[0] : "",
    github: github ? github[0] : "",
    portfolio: portfolio ? portfolio[0] : "",
  };
}

/**
 * Extract skills by matching the dictionary against the raw text.
 * We use word-boundary matching so "Java" doesn't match "JavaScript".
 */
function extractSkills(text) {
  const found = new Set();
  for (const skill of SKILL_DICTIONARY) {
    // Escape regex special chars in the skill name
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // For multi-word skills, allow flexible whitespace; for single-word, use word boundaries
    const pattern = skill.includes(" ")
      ? new RegExp(escaped.replace(/\\ /g, "\\s+"), "i")
      : new RegExp(`\\b${escaped}\\b`, "i");
    if (pattern.test(text)) found.add(skill);
  }
  return Array.from(found);
}

/* -------------------------------------------------------------------------- */
/*  4. SECTION SPLITTING                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Common headers that mark the start of Experience / Education / Projects / etc.
 * Used to split the resume into sections.
 */
const SECTION_HEADERS = [
  { key: "summary",      labels: /^(summary|profile|about|objective|professional summary)/i },
  { key: "experience",   labels: /^(work experience|professional experience|experience|employment history|work history|employment|career history)/i },
  { key: "education",    labels: /^(education|academic background|academics|educational background)/i },
  { key: "projects",     labels: /^(projects|personal projects|key projects|notable projects)/i },
  { key: "skills",       labels: /^(technical skills|skills|core competencies|technologies|tech stack)/i },
  { key: "certifications", labels: /^(certifications|certificates|licenses)/i },
  { key: "achievements", labels: /^(achievements|awards|honors|honours)/i },
  { key: "languages",    labels: /^(languages|languages known)/i },
];

/**
 * Split raw resume text into a map: { summary: "...", experience: "...", ... }
 */
function splitIntoSections(text) {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let currentKey = "header";
  let buffer = [];

  const flush = () => {
    if (currentKey && buffer.length) {
      sections[currentKey] = (sections[currentKey] || "") + buffer.join("\n").trim() + "\n";
    }
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Detect a header line: short line (<=5 words) that matches known labels
    const wordCount = line.split(/\s+/).length;
    const isHeaderCandidate = wordCount <= 6 && !/[.@;]$/.test(line);

    let matchedKey = null;
    if (isHeaderCandidate) {
      for (const { key, labels } of SECTION_HEADERS) {
        if (labels.test(line)) {
          matchedKey = key;
          break;
        }
      }
    }

    if (matchedKey) {
      flush();
      currentKey = matchedKey;
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}

/* -------------------------------------------------------------------------- */
/*  5. EXPERIENCE & EDUCATION PARSERS                                         */
/* -------------------------------------------------------------------------- */

/**
 * Parse the Experience section into a list of structured job entries.
 *
 * Each entry is a best-effort guess:
 *   { role, company, duration, description }
 *
 * Heuristic: a new job entry usually starts with a line that contains a date
 * range (e.g. "Jan 2020 - Present" or "2020 - 2022"), or is a title-case line.
 *
 * The header line is split into role/company/duration like this:
 *   1. First, find the date range at the end of the line and extract it.
 *   2. Then split what's left on common separators (|, –, -, @, ,) into
 *      role + company. If only one piece remains, that's the role.
 */
function parseExperience(rawText) {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // A date range looks like:
  //   "Jan 2021 - Present"
  //   "Jun 2018 - Dec 2020"   (month-year on both sides)
  //   "2020 - 2022"            (year only on both sides)
  //   "Aug 2016 to May 2018"
  const monthPat = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";
  const yearPat  = "(?:19|20)\\d{2}";
  const endPat   = `(?:present|current|${monthPat}\\s*${yearPat}|${yearPat})`;
  const dateRangeRegex = new RegExp(
    `(?:${monthPat}\\s*${yearPat}\\s*[-–to]+\\s*${endPat}|${yearPat}\\s*[-–to]+\\s*${endPat})`,
    "i"
  );

  // A line "looks like a new entry" if it ends with a date range, OR is a short title-case line.
  const looksLikeNewEntry = (line) =>
    dateRangeRegex.test(line) || /^[A-Z][A-Za-z0-9 &/.\-,@]{2,60}$/.test(line);

  const entries = [];
  let current = null;
  let descBuffer = [];

  const pushCurrent = () => {
    if (current) {
      current.description = descBuffer.join(" ").trim();
      entries.push(current);
    }
    current = null;
    descBuffer = [];
  };

  for (const line of lines) {
    if (looksLikeNewEntry(line) && (!current || dateRangeRegex.test(line))) {
      pushCurrent();
      current = { role: "", company: "", duration: "", description: "" };

      // 1. Extract the date range
      const dateMatch = line.match(dateRangeRegex);
      if (dateMatch) {
        current.duration = dateMatch[0].trim();
        // 2. Remove the date from the line, plus any trailing separators
        const before = line.replace(dateMatch[0], "").replace(/[\s|–\-,@]+$/, "").trim();
        // 3. Split the remaining text on the FIRST strong separator.
        //    We prefer | @ , (unambiguous). " at " with spaces is also a common
        //    role/company separator ("Engineer at Google"). Only fall back to –
        //    or - if none of those match.
        const strongSep = before.match(/^(.+?)\s*(?:\||@|,|\s+at\s+)\s*(.+)$/i);
        const weakSep   = before.match(/^(.+?)\s*(?:–|-|—)\s*(.+)$/);
        const sep = strongSep || weakSep;
        if (sep) {
          current.role = sep[1].trim();
          current.company = sep[2].trim();
        } else {
          current.role = before;
        }
      } else {
        // No date — treat the whole line as the role
        current.role = line;
      }
    } else if (current) {
      descBuffer.push(line);
    } else {
      // No entry yet — start one with this line as the role
      current = { role: line, company: "", duration: "", description: "" };
    }
  }
  pushCurrent();

  // Clean up: only keep entries that have at least a role
  return entries.filter((e) => e.role).slice(0, 8);
}

/**
 * Parse the Education section into a list of structured entries:
 *   { degree, institution, year }
 */
function parseEducation(rawText) {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const degreeKeywords = /(b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?sc|m\.?sc|b\.?a|m\.?a|b\.?com|m\.?com|bba|mba|ph\.?d|doctorate|diploma|high school|intermediate|senior secondary|class 12|class 10|master|bachelor)/i;
  const yearRegex = /\b(19|20)\d{2}\b(?:\s*[\-–to]+\s*(?:19|20)\d{2}|\s*[\-–]\s*present)?/i;

  const entries = [];
  let current = null;
  let descBuffer = [];

  const pushCurrent = () => {
    if (current) {
      current.details = descBuffer.join(" ").trim();
      entries.push(current);
    }
    current = null;
    descBuffer = [];
  };

  for (const line of lines) {
    const isDegreeLine = degreeKeywords.test(line);

    if (isDegreeLine && (!current || degreeKeywords.test(line))) {
      pushCurrent();
      current = { degree: "", institution: "", year: "", details: "" };

      // 1. Extract year (e.g. "2012 - 2016" or "2020")
      const yearMatch = line.match(yearRegex);
      if (yearMatch) current.year = yearMatch[0].trim();

      // 2. Remove the year from the line, plus any trailing separators (|, -, ,, etc.)
      const remaining = line
        .replace(yearRegex, "")
        .replace(/[\s|–\-,@]+$/, "")
        .trim();

      // 3. Split the remaining text on a strong separator (|, @, ,)
      //    Fall back to – or - only if no strong separator exists.
      const strongSep = remaining.match(/^(.+?)\s*(?:\||@|,)\s*(.+)$/);
      const weakSep   = remaining.match(/^(.+?)\s*(?:–|-|—)\s*(.+)$/);
      const sep = strongSep || weakSep;
      if (sep) {
        current.degree = sep[1].trim();
        current.institution = sep[2].trim();
      } else {
        current.degree = remaining;
      }
    } else if (current) {
      // Could be the institution or detail line
      if (!current.institution && /^[A-Z][A-Za-z&'.,\-\s]{3,80}$/.test(line) && !line.endsWith(".")) {
        current.institution = line;
      } else {
        descBuffer.push(line);
      }
    } else {
      current = { degree: line, institution: "", year: "", details: "" };
    }
  }
  pushCurrent();
  return entries.filter((e) => e.degree).slice(0, 6);
}

/* -------------------------------------------------------------------------- */
/*  6. TOP-LEVEL PARSE FUNCTION                                               */
/* -------------------------------------------------------------------------- */

/**
 * Main entry point: takes raw text, returns a structured resume object.
 * @param {string} text
 * @returns {object}
 */
export function parseResumeText(text) {
  const cleaned = (text || "").replace(/\r/g, "");
  const sections = splitIntoSections(cleaned);

  const personalInfo = {
    name: extractName(cleaned),
    email: extractEmail(cleaned),
    phone: extractPhone(cleaned),
    links: extractLinks(cleaned),
    summary: (sections.summary || "").trim(),
  };

  const skills = extractSkills(cleaned);
  const experience = parseExperience(sections.experience || "");
  const education = parseEducation(sections.education || "");

  return {
    personalInfo,
    skills,
    experience,
    education,
    meta: {
      sectionsDetected: Object.keys(sections),
      rawLength: cleaned.length,
      parsedAt: new Date().toISOString(),
    },
  };
}

/**
 * Convenience wrapper: extract + parse in one call.
 * @param {Express.Multer.File} file
 */
export async function parseResumeFile(file) {
  const text = await extractText(file);
  const parsed = parseResumeText(text);
  return { ...parsed, meta: { ...parsed.meta, fileName: file.originalname } };
}
