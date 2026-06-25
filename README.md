# Resume Parser 

A sleek, production-ready **Resume Parser** web application built with **React + Vite + Tailwind CSS + Framer Motion** on the frontend and **Node.js + Express** on the backend. It extracts structured candidate data (Name, Email, Phone, Skills, Experience, Education) from PDF and DOCX resumes using a custom regex-and-keyword-based "AI" parsing engine.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Express%20%7C%20Tailwind%20%7C%20Framer%20Motion-7c3aed)

---

## Features

- **Drag-and-drop upload zone** — accepts `.pdf`, `.doc`, and `.docx` files with a stylish drop-pulse animation.
- **AI-style parsing engine** — uses regex heuristics and a 150+ skill dictionary to extract structured data (no paid APIs required).
- **Beautiful results grid** — four animated cards: Personal Info, Skills, Experience, Education.
- **Peculiar animations**:
  - Header parallax + scroll-progress bar
  - Floating background orbs
  - Staggered "fall-into-place" card reveal
  - Typewriter effect on the candidate's name
  - Springy skill-chip pop-in
  - Animated multi-stage loader
- **Fully responsive** — works on mobile, tablet, and desktop in any orientation.
- **Backend proxy** — Vite dev server proxies `/api` requests to Express, so no CORS headaches.

---

### Prerequisites

- [Node.js](https://nodejs.org) v18 or newer (includes npm)

### 1. Start the backend (Terminal 1)

```bash
cd server
npm install
npm start
```

The API runs on **http://localhost:5000**.

### 2. Start the frontend (Terminal 2)

```bash
cd client
npm install
npm run dev
```

The app runs on **http://localhost:5173**.

### 3. Open the app

Visit **http://localhost:5173** in your browser, drag in a resume file, and click **Parse Resume**.

---

## Project Structure

```
resume-parser/
├── client/                         # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundFx.jsx       # Floating orbs + dotted grid
│   │   │   ├── EducationCard.jsx      # Education timeline card
│   │   │   ├── ExperienceCard.jsx     # Experience timeline card
│   │   │   ├── FileUpload.jsx         # Drag-and-drop upload zone
│   │   │   ├── Header.jsx             # Parallax sticky header
│   │   │   ├── Loader.jsx             # Multi-stage animated loader
│   │   │   ├── ParseButton.jsx        # Gradient CTA button
│   │   │   ├── PersonalInfoCard.jsx   # Name + contact info card
│   │   │   ├── ResultsGrid.jsx        # Layout for the 4 result cards
│   │   │   ├── SkillsCard.jsx         # Skill pill chips
│   │   │   └── TypewriterText.jsx     # Types-out text effect
│   │   ├── App.jsx                    # Root component
│   │   ├── index.css                  # Tailwind + custom layers
│   │   └── main.jsx                   # React root
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                         # Express backend
│   ├── package.json
│   ├── parser.js                     # The "AI" parsing engine
│   └── server.js                     # Express app + multer upload
├── docs/
│   ├── SETUP_GUIDE.md                # Beginner-friendly setup guide
│   └── sample-resume.txt             # Sample resume for testing
└── README.md
```

---

## How the Parser Works

### 1. Heuristic Regex (Email, Phone, Links)
- **Email:** RFC-style pattern matching
- **Phone:** Handles `+country-code`, dashes, dots, spaces, parentheses
- **Links:** Detects LinkedIn, GitHub, and arbitrary portfolio URLs

### 2. Keyword Dictionary (Skills)
A curated list of 150+ skills across languages, frameworks, databases, cloud/DevOps tools, and data/AI libraries. Each entry is matched against the resume text using **word boundaries** (so "Java" doesn't accidentally match "JavaScript").

### 3. Section Detection (Experience, Education)
The resume text is split into sections based on common header keywords (`EXPERIENCE`, `WORK HISTORY`, `EDUCATION`, etc.). Within each section:
- **Experience parser** detects new job entries by looking for date ranges, then splits each entry into `role`, `company`, `duration`, and `description`.
- **Education parser** detects degree keywords (`B.Tech`, `M.Sc`, `PhD`, etc.) and extracts degree, institution, and year.

### Output JSON shape

```json
{
  "personalInfo": {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "+1 (415) 555-0192",
    "links": {
      "linkedin": "linkedin.com/in/sarahjohnson",
      "github": "github.com/sarahj",
      "portfolio": ""
    },
    "summary": "Senior full-stack engineer with 7+ years..."
  },
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "..."],
  "experience": [
    {
      "role": "Senior Software Engineer",
      "company": "Stripe",
      "duration": "Jan 2021 - Present",
      "description": "Led the migration of the payments dashboard..."
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "Indian Institute of Technology, Delhi",
      "year": "2012 - 2016",
      "details": "..."
    }
  ],
  "meta": {
    "sectionsDetected": ["header", "summary", "experience", "education", "skills"],
    "rawLength": 1842,
    "fileName": "sarah-johnson-resume.pdf",
    "parsedAt": "2025-01-15T10:42:00.000Z"
  }
}
```

---

## Design System

- **Palette:** Deep ink (`#08080f`) background with violet (`#a78bfa`), cyan (`#22d3ee`), coral (`#fb7185`), and mint (`#34d399`) accents.
- **Typography:** `Space Grotesk` for display headings, `Inter` for body, `JetBrains Mono` for code chips.
- **Surfaces:** Glassmorphism (`backdrop-blur` + low-alpha borders), animated gradient borders, soft glow shadows.
- **Motion:** Framer Motion for springy staggers, parallax scroll, and micro-interactions.

---

## 🛠️ Customization

### Add new skills
Edit `server/parser.js` → find `SKILL_DICTIONARY` → add your entries.

### Change the color theme
Edit `client/tailwind.config.js` → `theme.extend.colors`.

### Add a new result card
1. Create `client/src/components/MyNewCard.jsx`
2. Import it in `client/src/components/ResultsGrid.jsx`
3. Add it to the grid layout

---

## API Reference

### `POST /api/parse`
Upload a resume file and get structured JSON back.

**Request:** `multipart/form-data` with field name `resume`

**Response:** `200 OK` — JSON object (see shape above)

**Errors:**
- `400` — No file uploaded / unsupported file type
- `500` — Parser failure (e.g. corrupted file, scanned PDF)

### `GET /api/health`
Returns `{ "status": "ok", "service": "resume-parser", "time": "..." }`. Useful for sanity-checking the backend.

---

## Credits

Built with:
- [React](https://react.dev/) · [Vite](https://vitejs.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [Framer Motion](https://www.framer.com/motion/) · [Lucide Icons](https://lucide.dev/)
- [Express](https://expressjs.com/) · [Multer](https://github.com/expressjs/multer) · [pdf-parse](https://github.com/mozilla/pdf.js) · [mammoth](https://github.com/mwilliamson/mammoth.js)

---

