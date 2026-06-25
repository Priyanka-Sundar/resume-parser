# 📖 Resume Parser — Complete Setup Guide (For Absolute Beginners)

> **Don't worry if you've never opened a terminal before.** This guide walks you through every single click, every command, and every screen — with pictures described in words. By the end, you'll have the Resume Parser running on your own computer.

---

## 📋 What You'll Need (Overview)

You're going to do **6 main things**:

1. Install **Node.js** (the engine that runs the code)
2. Download & extract the project folder
3. Open the **Terminal** (Command Prompt)
4. Install dependencies & start the **backend**
5. Install dependencies & start the **frontend**
6. Open the browser and use the app

Let's go through each one. 🚀

---

## ✅ Step 1 — Prerequisites: Install Node.js

Node.js is a free program that lets your computer run JavaScript outside the browser. We need it to run both the frontend and the backend.

### 1.1 Check if Node.js is already installed

1. **Open the Terminal / Command Prompt:**
   - **Windows:** Press the `Windows key` on your keyboard, type `cmd`, and press `Enter`. A black window will open.
   - **Mac:** Press `Command (⌘) + Space`, type `Terminal`, and press `Enter`.
   - **Linux:** Press `Ctrl + Alt + T`.

2. **Type this exact command and press Enter:**
   ```bash
   node --version
   ```

3. **Look at the result:**
   - ✅ If you see something like `v20.11.0` or `v18.17.0` — **Node.js is installed! Skip to Step 2.**
   - ❌ If you see `'node' is not recognized` or `command not found` — you need to install it. Continue below.

### 1.2 Install Node.js (if not installed)

1. Open your browser and go to: **https://nodejs.org**
2. You'll see two big green download buttons. Click the one that says **"LTS"** (Long Term Support). It's the recommended one.
   - The file will be something like `node-v20.11.0-x64.msi` (Windows) or `node-v20.11.0.pkg` (Mac).
3. **Once downloaded, double-click the file** to open the installer.
4. **Click through the installer:**
   - Click **"Next"** → accept the license → **"Next"** → **"Next"** → **"Next"** → **"Install"**.
   - **Windows may ask for permission** — click **"Yes"**.
   - **IMPORTANT:** Make sure the option **"Automatically install the necessary tools"** is checked if it appears. (If it's not there, that's fine — just continue.)
5. Click **"Finish"**.

### 1.3 Verify Node.js is now installed

1. **Close any old Terminal window** and open a **new one** (same way as in step 1.1).
2. Type these two commands, pressing Enter after each:
   ```bash
   node --version
   npm --version
   ```
3. You should now see version numbers for both. ✅

> **npm** ("Node Package Manager") comes bundled with Node.js. You'll use it to install the project's dependencies.

---

## 📦 Step 2 — Download & Extract the Project Folder

### 2.1 Get the project ZIP file

You should have received a file called something like `resume-parser.zip`.

1. **Save it to a place you can easily find**, for example:
   - **Windows:** `C:\Users\YourName\Downloads\`
   - **Mac:** `/Users/YourName/Downloads/`

### 2.2 Extract the ZIP

1. **Right-click** the `resume-parser.zip` file.
2. Choose:
   - **Windows:** "Extract All…" → click **"Extract"**
   - **Mac:** "Open" (it auto-extracts) — or double-click the file
3. You should now have a folder called `resume-parser` containing three subfolders:
   ```
   resume-parser/
   ├── client/      ← the React frontend
   ├── server/      ← the Express backend
   └── docs/        ← this guide lives here
   ```

> 💡 **Tip:** Move the `resume-parser` folder somewhere easy to reach, like `C:\projects\resume-parser` (Windows) or `~/Projects/resume-parser` (Mac).

---

## 💻 Step 3 — Open the Terminal

You'll need **two terminal windows** — one for the backend, one for the frontend.

### 3.1 Open Terminal #1 (for the backend)

1. Open a Terminal as described in Step 1.1.
2. **Navigate into the project folder.** Type `cd` (short for "change directory"), add a space, then the path to the folder:
   - **Windows example:**
     ```bash
     cd C:\projects\resume-parser\server
     ```
   - **Mac/Linux example:**
     ```bash
     cd ~/Projects/resume-parser/server
     ```
   - Press **Enter**.
3. ✅ You're now "inside" the `server` folder. Your terminal prompt should show `server` somewhere in the path.

### 3.2 Open Terminal #2 (for the frontend)

1. **Without closing Terminal #1**, open a second Terminal window:
   - **Windows:** Open another `cmd` window (Windows key → `cmd` → Enter)
   - **Mac:** Terminal menu → **"New Window"** (or press `⌘ + N`)
2. Navigate into the `client` folder:
   - **Windows:**
     ```bash
     cd C:\projects\resume-parser\client
     ```
   - **Mac/Linux:**
     ```bash
     cd ~/Projects/resume-parser/client
     ```
   - Press **Enter**.

> 💡 You now have **two terminals side-by-side**. One is in `server/`, the other in `client/`. This is normal for full-stack projects.

---

## ⚙️ Step 4 — Start the Backend (Server)

In **Terminal #1** (the one inside the `server` folder):

### 4.1 Install dependencies (first time only)

Type this command and press Enter:

```bash
npm install
```

- This downloads all the libraries the backend needs (Express, multer, pdf-parse, mammoth, cors).
- **Be patient** — it can take 1–3 minutes the first time.
- You'll see a lot of text scrolling by. That's normal. ✅
- When it's done, you'll see your prompt again (something like `C:\projects\resume-parser\server>`).

> ⚠️ If you see red error text saying `npm ERR!`, check your internet connection, then try `npm install` again.

### 4.2 Start the backend server

Type this command and press Enter:

```bash
npm start
```

- You should see a banner like this:
  ```
  ─────────────────────────────────────────────
    Resume Parser API running
    → http://localhost:5000
    → POST /api/parse  (multipart field: "resume")
  ─────────────────────────────────────────────
  ```
- ✅ **Leave this terminal open!** The backend is now running.
- ⚠️ If you close this terminal, the backend stops.

> 🧪 **Quick test:** Open your browser and visit **http://localhost:5000/api/health** — you should see `{"status":"ok",...}`. That means the backend works.

---

## 🎨 Step 5 — Start the Frontend (Client)

Now switch to **Terminal #2** (the one inside the `client` folder):

### 5.1 Install dependencies (first time only)

Type this command and press Enter:

```bash
npm install
```

- This downloads React, Vite, Tailwind, Framer Motion, Lucide icons, and more.
- **Be patient** — this can take 2–5 minutes the first time, longer than the backend.
- When you see the prompt again, you're ready.

### 5.2 Start the frontend dev server

Type this command and press Enter:

```bash
npm run dev
```

- You should see something like:
  ```
    VITE v5.3.1  ready in 450 ms

    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose
  ```
- ✅ **The frontend is now running.** Leave this terminal open.
- 💡 Vite may automatically open your browser. If it doesn't, move to Step 6.

---

## 🌐 Step 6 — Open the App in Your Browser

1. Open your browser (Chrome, Firefox, Edge, or Safari — Chrome works best).
2. In the address bar at the top, type exactly:
   ```
   http://localhost:5173
   ```
3. Press **Enter**.

You should now see the **Resume Parser** app — a dark, sleek page with:
- A header at the top that says "ResumeParser"
- A big drag-and-drop zone in the middle
- A glowing **"Parse Resume"** button below it

🎉 **Congratulations — the app is running!**

---

## 🖱️ Step 7 — Actually Use the App

### 7.1 Upload a resume

1. **Get a resume file ready.** You need a `.pdf`, `.doc`, or `.docx` file. If you don't have one:
   - Use any resume you already have, OR
   - Search Google for "sample resume pdf" and download one, OR
   - Use the **`sample-resume.txt`** file in the `docs/` folder — but you'll need to convert it to `.docx` first (open it in Word → "Save As" → `.docx`).

2. **Drag the file** from your file explorer onto the big dashed rectangle that says **"Drag & drop your resume"**.
   - OR click the rectangle → a file picker opens → select your resume file.

3. Once uploaded, you'll see a small card showing the file name and size, with the message **"Ready to parse"**.

### 7.2 Parse the resume

1. Click the glowing **"✨ Parse Resume"** button.
2. A loader will appear showing steps like:
   - "Uploading file to secure parser…"
   - "Extracting text from document…"
   - "Matching skills against dictionary…"
3. After a few seconds, the page will scroll down automatically to reveal the **results grid**.

### 7.3 Read the results

You'll see four beautiful cards:

| Card | What it shows |
|------|---------------|
| **Personal Information** | Name (typed out letter-by-letter), email, phone, LinkedIn, GitHub, portfolio, and any summary |
| **Skills** | All skills detected, shown as colorful pill chips that pop in |
| **Experience** | A timeline of past jobs with role, company, dates, and description |
| **Education** | Degrees, schools, graduation years |

### 7.4 Try again

- Click the small **"↻ Reset"** link under the Parse button to clear everything and upload a different resume.

---

## 🛑 How to Stop the App

When you're done, you need to stop both servers:

1. Go to **Terminal #1** (backend) — click inside it, then press **`Ctrl + C`**. Type `Y` if it asks "Terminate batch job?".
2. Go to **Terminal #2** (frontend) — same thing: click inside, press **`Ctrl + C`**.
3. You can now close both terminal windows.

To start the app again tomorrow, just repeat Steps **3, 4.2, 5.2, and 6** — you don't need to run `npm install` again.

---

## 🆘 Troubleshooting (Common Issues)

### Issue 1: "Port 5000 is already in use"
Another program is using port 5000. Fix it:
```bash
# Windows (in the server folder):
set PORT=5001 && npm start
# Mac/Linux (in the server folder):
PORT=5001 npm start
```
Then update `client/vite.config.js` — change `http://localhost:5000` to `http://localhost:5001`.

### Issue 2: "Port 5173 is already in use"
Vite will offer to use the next port (5174). Just open the URL it suggests.

### Issue 3: "Cannot find module 'express'" or similar
You forgot to run `npm install`. Go back to Steps 4.1 and 5.1.

### Issue 4: The page loads but "Parse Resume" fails
Make sure the **backend is running** (Terminal #1 should still be open and showing the banner). Visit http://localhost:5000/api/health to verify.

### Issue 5: Parsing fails on a PDF
Some PDFs are "scanned images" (not real text). The parser can't read images — it only reads text. Try a different resume that was created in Word/Google Docs and exported to PDF.

### Issue 6: Skills list is empty
The parser only recognizes a fixed dictionary of skills. If your resume uses unusual names (e.g. "TS" instead of "TypeScript"), they won't be detected. Open `server/parser.js` and add your custom skills to the `SKILL_DICTIONARY` array.

---

## 📁 Project Structure (Reference)

```
resume-parser/
├── client/                    ← React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundFx.jsx
│   │   │   ├── EducationCard.jsx
│   │   │   ├── ExperienceCard.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ParseButton.jsx
│   │   │   ├── PersonalInfoCard.jsx
│   │   │   ├── ResultsGrid.jsx
│   │   │   ├── SkillsCard.jsx
│   │   │   └── TypewriterText.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                    ← Express backend
│   ├── package.json
│   ├── parser.js              ← The "AI" parsing engine
│   └── server.js              ← Express app
└── docs/
    ├── SETUP_GUIDE.md         ← You are here
    └── sample-resume.txt      ← A test resume you can convert to .docx
```

---

## ❓ Still Stuck?

If something doesn't work:
1. Read the error message carefully — it usually tells you exactly what's wrong.
2. Make sure both terminals are open and running.
3. Make sure you're in the right folder (`server` for backend, `client` for frontend).
4. Try restarting both servers (Ctrl+C, then `npm start` / `npm run dev` again).

**You've got this. 💪**
