# Vibe Coding with Claude Code — Prep & Setup

Everything to do BEFORE the talk. The live run-of-show is in [SCRIPT.md](SCRIPT.md).

---

## 1. Pre-flight checklist (do this during the dry run)

- [ ] Open `slides/intro-claude-presentation.html`, click through all 12 slides in fullscreen. Check fonts load (needs internet).
- [ ] **Replace the QR links:** edit `slides/assets/regen-qr.py` (FEEDBACK_URL + BEER_URL), run `python3 slides/assets/regen-qr.py`, refresh the deck.
- [ ] **Demo 2 app ready (`~/streak-live-for-review`).** This is the finished Streak, built earlier with the loop; a clean copy is saved in the kit at `output/streak`. Confirm it runs and the build conversation resumes:
  ```sh
  cd ~/streak-live-for-review
  npm install        # if node_modules isn't there
  npm run dev        # Streak loads at localhost:5173
  claude --resume    # the build session shows up and reprints the conversation
  ```
  If you rename the folder, rename its history dir too or resume breaks:
  `mv ~/.claude/projects/-home-arben-streak-live ~/.claude/projects/-home-arben-streak-live-for-review`.
- [ ] **Demo 1 pre-build.** Generate both hero pages from `demos/demo-1-two-prompts/` into `output/two-prompts/`: `hero-advance-prompt.md` → `advance`, `hero-normal-words.md` → `normal`. Open both in browser tabs; screenshot as backup.
- [ ] Have Claude Code installed and logged in. Run `claude --version`.
- [ ] *(Optional)* Dry-run the **live skill creation** (Demo: slide 9) once, then delete the test skill, only if you'll do it live.
- [ ] Zoom your terminal font up so remote viewers can read it. Test screen-share on Meet.
- [ ] **Recording:** set up OBS + iPhone webcam and record a 60s test (see § 2).

**Recovery kit (if a live moment goes sideways):**
- The finished app is already there, so worst case just demo it and talk the workflow.
- If `/request-code-review` stalls, say "great, this is the real workflow," and keep narrating, or fall back to walking `src/lib/streak.js` by hand.

---

## 2. Recording & screen-share (Windows + OBS)

**Topology (no files to move):** The live demo runs inside the **Linux VM**, deck, terminal, and Claude Code are already there. On the **Windows host** you run OBS (records screen + your face) and Google Meet (shares your screen). OBS captures everything on screen, including the VM window and the Meet call.

### iPhone as webcam (Windows has no Continuity Camera; needs an app)
1. iPhone: install **Camo** (recommended) or **iVCam** from the App Store.
2. Windows: install the matching desktop app (reincubate.com/camo or e2esoft iVCam).
3. **Connect via USB** (more reliable than Wi-Fi for a live talk). Trust the computer.
4. Verify: open the Windows **Camera** app, your iPhone feed should appear. (Free tiers are fine for a small corner overlay.)

### OBS scene (one-time, ~5 min)
1. **Settings → Output → Recording:** Format `mp4`, Quality "High". **Settings → Video:** Base + Output resolution = your screen res, 30 FPS. **Settings → Audio:** select your mic.
2. **Sources → + Display Capture** → pick your monitor. (This grabs the VM window + Meet.)
3. **Sources → + Video Capture Device** → select Camo / iVCam → drag and resize into a **bottom corner**. Keep it small so it never covers the terminal or code.
4. Big red **Start Recording** → saves a local `.mp4`. **Stop Recording** when done.

### Google Meet
Share your **whole screen** (or just the VM window). Don't bother with Meet's built-in recording, OBS already captures everything.

### Dry-run recording checklist
- [ ] iPhone webcam app installed both sides; iPhone shows in the Windows **Camera** app.
- [ ] OBS scene built; **face overlay in a corner**, not over code.
- [ ] **Mic works**, talk and watch the OBS audio meter move.
- [ ] **Record 60 seconds** of clicking the deck + typing in the terminal, then play it back: face visible, text readable, audio in sync.
- [ ] Free disk space for ~1–2 GB per hour.
- [ ] **If Display Capture is black:** change the capture method in the source's properties, or run OBS as Administrator.
- [ ] **If the VM window is laggy under OBS:** lower OBS output to 1080p / 30fps; close other apps.

---

## 3. Reference: how the finished Streak was built

You don't run this live (Demo 2 shows the finished app + a code review). Keep it for your dry run and to explain how it was made. The loop: `/brainstorming` → `/plan` → `/develop` → `/request-code-review`, on a `CLAUDE.md` foundation.

### Rebuild from scratch (only if you need a fresh app)
The scaffold (blank React + Vite + Tailwind + `CLAUDE.md`) is at `demos/streak-scaffold`. From the repo root:
```sh
export STREAK=~/streak-live
mkdir -p "$STREAK"
cp -r demos/streak-scaffold/. "$STREAK"/      # the /. copies CONTENTS into $STREAK
cd "$STREAK"
git init -q && git config user.name demo && git config user.email demo@example.com
git add -A && git commit -q -m "scaffold baseline"
npm install
npm run dev
```

### The `CLAUDE.md` it worked under
```markdown
# Streak — a habit tracker

The blank app is already scaffolded (React + Vite + Tailwind). Build features into it. Do not re-scaffold or change the stack.

## Stack (do not change without asking)
React + Vite + Tailwind. localStorage for saving. No backend, no accounts, no new dependencies.

## How we work
- Small steps. After each one, tell me how to run and verify it.
- Ask before coding if anything is unclear, don't guess.
- Don't add features I didn't ask for. Suggest them instead.
- Nothing is "done" until I confirm it works.

## Done = the MVP
1. Add a habit  2. Toggle "done today"  3. Show streak "N"  4. Delete a habit  5. Persists on refresh
```

### The prompts, stage by stage
**`/brainstorming` seed:**
```
Help me spec a small habit tracker called "Streak". Rules are in CLAUDE.md (React + Vite + Tailwind, localStorage, no backend). The app is already scaffolded and running (blank Tailwind page) — build features into it, don't re-scaffold or change the stack.

MVP Features:
1. Add a habit by name.
2. A "done today" toggle per habit.
3. Current streak per habit, consecutive days done, ending today, shown as "N".
4. Delete a habit.
5. Persists across refresh.
Data model: array of habits, each { id, name, history } where history maps "YYYY-MM-DD" → true.
Streak rule: count back from today through consecutive true days; if today isn't done yet, show the run through yesterday.
Keep it simple and readable. Ask me anything ambiguous before we settle the design.
```
**`/plan`** — turns the spec into ordered steps; read and approve it.
**`/develop`** — executes the plan. Drop to Sonnet first (`/model sonnet`): plan and review with the strong model, implement with the faster one.
**`/request-code-review`** — verify; read `computeStreak` yourself.

**Optional Flow 2 (a second feature) `/brainstorming` seed:**
```
Add one feature to Streak: a 7-day grid per habit showing which of the last 7 days were marked done (most recent on the right). Same constraints as CLAUDE.md, no new dependencies. Spec it with me, then we'll plan and build.
```

### Opus vs Sonnet (if asked)
| | Opus (claude-opus-4-8) | Sonnet (claude-sonnet-4-6) |
| --- | --- | --- |
| Best at | hardest reasoning, planning, code review | fast, capable everyday coding |
| Speed | slower, more deliberate | noticeably faster |
| Cost | premium tier (about 1.5 to 2x Sonnet) | the cheaper workhorse |
| Use it for | spec, plan, review | develop / implement |

One-liner: "Use the strongest model to think, a faster one to do the grunt work. The workflow matters more than the model."

### Handling dead air (for any live generation)
- **Predict** before you press enter, then let the room watch it happen.
- **Narrate** the stream as it appears.
- **Sell the why** by tying the step back to the loop.
- **Take a question** during long runs.

### Manual fallback (if a slash command misbehaves)
Say the beat in plain English: "spec this with me", "give me a plan first", "build step one and tell me how to verify", "summarize what changed and explain the streak logic." The commands are shortcuts for those sentences.
