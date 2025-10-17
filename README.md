
<img width="2186" height="1656" alt="image" src="https://github.com/user-attachments/assets/38b6f13d-39bf-41e9-8bd9-bce3d3719bc0" />


WODSpark — Crossfit WOD Generator
=====================

A tiny React + Vite app that generates CrossFit-style WODs **without any AI**.
It uses a curated movement dataset, equipment and soreness filters, and a seeded
random generator to build:

- A Lift block (minutes based on the split)
- A HIIT block (EMOM / AMRAP / For-Time patterns)
- Smart Warm-up and Cool-down matched to the muscles actually used in the Lift + HIIT

## Mac Dock Shortcut (Automator app)

Make WODSpark feel like a native app: one click launches the server, opens the browser, and closes the server when you quit the window.

### What I did (super simple)

1) **Create the launcher script** (in your project root):
   - `WODSpark.command` (executable): starts Vite (`dev` or `preview`) and opens a Chrome app window, then shuts down on close.
   - If you used the version that prints a URL (`WODSparkForShortcuts.command`), that works too.

2) **Automator → New → Application**
   - Action: **Run Shell Script**
      - **Shell:** `zsh`
      - **Input:** `Input`
      - **Pass input:** `to stdin`
      - **Script:**
        ```zsh
        sh /Users/<you>/dev/repos/crossfit-wod-generator/WODSpark.command
        ```
        *(Use the full path to your script. Add `dev 5173` or `preview 5173` args if you want to force a mode/port.)*

   - Action: **Open** → **Shell Script Result**
     *(This opens the URL the script prints, if you use the “prints URL” variant. If your script already launches the Chrome app window, this step is optional.)*

3) **Save** as `WODSpark.app` and **drag it to the Dock**.

> First run: macOS may block the script. Fix once:
> ```bash
> chmod +x /path/to/WODSpark*.command
> ```

### Tips

- **Preview vs Dev**
   - `./WODSpark.command preview 5173` → serves the last build (`npm run build` first).
   - `./WODSpark.command dev 5173` → hot-reload dev server.

- **Chrome app window**
  The script launches Chrome with a temporary profile and waits (`open -W`) so closing that window auto-stops the server.

- **Change browser**
  Replace "Google Chrome" with "Brave Browser" or "Microsoft Edge" in the script. Safari can’t cleanly signal a single-window close.

- **Logs**
  Check `/tmp/wodspark.log` if something doesn’t open.

Quick start
-----------
```bash
npm install
npm run dev
# open http://localhost:5173
```

Requirements
------------
- Node.js 18+ recommended
- npm 8+ recommended

No API keys or environment files are required.

Run scripts
-----------
- `npm run dev` – start Vite dev server (default on `http://localhost:5173`)
- `npm run build` – create a production build
- `npm run preview` – preview the build locally


Project structure
-----------------
```
crossfit-wod-generator/
├─ index.html
├─ package.json
├─ src/
│  ├─ App.tsx                 # Layout; top bar + two-column grid
│  ├─ Board.tsx               # WOD whiteboard (title, quote, warm-up, Lift, HIIT, cool-down)
│  ├─ Controls.tsx            # Session/date, total time, equipment & soreness selectors
│  ├─ main.tsx                # Bootstraps React + theme.css
│  ├─ store.tsx               # Global state; generation calls; preselect all equipment
│  ├─ theme.css               # Light/dark theme and basic styling (v6 look)
│  ├─ data/
│  │  └─ wodLifts.ts         # Movement data + warmup/cooldown library
│  ├─ types/
│  │  └─ WodMovements.ts     # TS types (Equipment, MuscleGroup, Movement, etc.)
│  └─ whiteboard/
│     ├─ exportBoard.ts      # Export the WOD board as PNG
│     ├─ generator.ts        # WOD generators (Lift/HIIT) + smarter buildPrep()
│     └─ quotes.ts           # Longer motivational quotes (tagged by muscles)
```


How it generates a WOD
----------------------
1) **Lift minutes & HIIT minutes** are derived from the *Total workout time* and the *Split*
   (slider in the WOD panel header).

2) **Lift selection**
    - Filters candidate lifts by your **selected equipment**.
    - Chooses a **focus muscle** from each candidate’s `strainedMuscleGroups`, excluding
      anything you checked under **What hurts**.
    - Picks a matching lift for that focus, then decides one of:
        - *Build to a heavy 5-4-3-2-1*
        - *EMOM X: N reps* (if the lift supports EMOM and time is adequate)
        - *Every 2:00 for S sets: R reps*

    - **NEW v6.1**: The lift also returns a **full set of muscles used** (`groups`), preferring
      `usedMuscleGroups` when present, otherwise falling back to `strainedMuscleGroups`.

3) **HIIT selection**
    - Filters HIIT pool by **equipment**.
    - Chooses **2–5 movements** depending on HIIT minutes (2 movements only at 5 min).
    - Randomly selects **EMOM** or **AMRAP** format (with a light “For Time” option when long).
    - Computes a union of the chosen movements’ `usedMuscleGroups` as HIIT `groups`.

4) **Warm-up & Cool-down (smarter)**
    - `buildPrep()` creates `primary = lift.groups ∪ hiit.groups`
    - Warm-ups and cool-downs are ranked by **overlap** with `primary` and the top entries are chosen.
    - You’ll see prep that better matches the day’s actual training.

5) **Quotes**
    - Picks a longer motivational quote, optionally tagged to the primary muscle groups.


Controls overview
-----------------
- **Date** – used in the seed for reproducible generation.
- **Total workout time (20–60)** – excludes warm-up and cool-down.
- **Split slider** – percent of time allocated to **Lift** / **HIIT**.
- **Equipment** – preselected to **all equipment** by default. Uncheck to constrain WOD.
- **What hurts (avoid in Lift)** – mark any sore areas to avoid picking a lift that strains them.
- **Refresh buttons** on the whiteboard – independently regenerate **Lift** or **HIIT** with the current settings.


Export
------
Click **Export WOD** to save the current board as a PNG (client-side capture via `html2canvas`).


Troubleshooting
---------------
- **Blank page / console error about context**: Make sure components are wrapped in `<BoardProvider>`.
- **No movements appear**: If you unselect all equipment, the app falls back to a minimal set, but you may get fewer choices.
- **TypeScript errors**: Run `npm install` again to ensure `@types/react` and TS are installed.
- **Vite dev server not accessible**: It defaults to `http://localhost:5173`. If the port conflicts, Vite will prompt an alternative in the terminal.

Roadmap ideas
-------------
- Optional “General HIIT” mode biasing monostructural pieces (row/bike/run).
- Per-movement difficulty tuning and round-time estimations.
- Personal PR logging (commented stubs can be added if/when you want).


License
-------
Do whatever you want, just don’t blame us for burpees.
