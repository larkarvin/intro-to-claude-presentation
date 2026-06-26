# Vibe Coding with Claude Code: Talk Script & Run-of-Show

**When:** Sat June 27, 8:00–9:00 PM (Asia/Manila) · **Where:** Google Meet
**Deck:** open `slides/intro-claude-presentation.html` in your browser, press **F** for fullscreen, **→ / ←** to navigate. (Terminal-theme variant: `slides/intro-claude-terminal-theme.html`.)
**Live build target:** `Streak`, a habit tracker (React + Vite + Tailwind, localStorage, no backend).

> Golden rule for the whole hour: **you're in command.** Narrate your *thinking*, not just your typing.
> If something breaks, say "great, this is the real workflow" and debug it out loud. That IS the lesson.

---

## 0. TALK OUTLINE (the 30-second mental map)

1. **Hook** *(slide 1)*: "I'm not going to write code tonight. I'm going to direct it." (2 min)
2. **Frame** *(slide 2)*: what this is, who it's for. (3 min)
3. **The big idea** *(slide 3)*: you're in command. (3 min)
4. **Fundamentals are king** *(slide 4)*: learn what your code does. (2 min)
5. **The workflow** *(slide 5)*: spec → plan → develop → review, on a foundation. (4 min)
6. **Slop vs quality** *(slide 6)*: where slop comes from, and the cure. (2 min)
7. **The anti-slop formula** *(slide 7)*: specify · constrain · chunk · scrutinize. (2 min)
8. **DEMO 1: same page, two prompts** *(slide 8)*: specific vs vague, proof of the formula. (5 min)
9. **Skills** *(slide 9)*: teach it once, reuse forever (optional: build one LIVE). (3 min)
10. **Claude for everyone** *(slide 10)*: not just coders. (2 min)
11. **DEMO 2: LIVE BUILD, Streak** *(slide 11)*: the workflow, the main event. (24 min)
12. **End card** *(slide 12)*: feedback + beer QR + Q&A. (6 min)

Total ≈ 58 min. Slides 1–10 are framing + Demo 1; slide 11 is the main build; slide 12 is the close.
Two demos: **Demo 1** = *the prompt* matters (pre-built, shown); **Demo 2** = *the workflow* matters (built live).

---

## 1. PRE-FLIGHT (do this TONIGHT during the dry run)

- [ ] Open `slides/intro-claude-presentation.html`, click through all 12 slides in fullscreen. Check fonts load (needs internet).
- [ ] **Replace the QR links:** edit `slides/assets/regen-qr.py` (FEEDBACK_URL + BEER_URL) → run `python3 slides/assets/regen-qr.py` → refresh deck.
- [ ] Warm the npm cache so the live `npm install` is fast, run the scaffold once tonight in a throwaway folder, then delete it.
- [ ] Have Claude Code installed and logged in. Run `claude --version`.
- [ ] Live-build folder is `output/streak` (keep it empty until showtime).
- [ ] Zoom your terminal font up (so remote viewers can read it). Test screen-share on Meet.
- [ ] **Recording:** set up OBS + iPhone webcam and record a 60s test, see **§ 7** at the bottom.
- [ ] **DEMO 1 pre-build (do NOT build this live):** generate both hero pages from the prompts in `demos/demo-1-two-prompts/`, `hero-advance-prompt.md` → `output/two-prompts/advance`, and `hero-normal-words.md` → `output/two-prompts/normal`. Open both in browser tabs and screenshot them as backup. See **§ 3**.
- [ ] *(Optional)* Dry-run the **live skill creation** prompt (slide 9) once, then delete the test skill, only if you plan to do that demo live.
- [ ] Do ONE full dry run of the **Streak** build flows (§ 4) end-to-end. Time it.

**Recovery kit (if live build goes sideways):**
- Keep a finished copy of `streak` in a separate folder. Worst case, `cd` into it and show the working app.
- If `npm install` hangs, keep talking through the workflow slides, it's fine.

---

## 2. SLIDE-BY-SLIDE TALK TRACK (framing slides, ~20 min)

### Slide 1: Title
> "Welcome. Tonight is 'vibe coding', but I want to show you the *grown-up* version. The headline: **you don't write the code, you direct it.** You're in command. And the three words to remember all night: **plan, guard, verify.**"

### Slide 2: A community jam, not a course
> "This is informal and free. If you've never touched a terminal, you're exactly who this is for. I'll make mistakes on purpose-ish, and you'll watch me dig out, because *that's* the real skill."

### Slide 3: You direct it
> "Think of the AI as a fast, tireless assistant, endlessly helpful, but **sometimes confidently wrong.** So your job isn't to type faster. It's to stay in command: you own the plan, the rules, and the final 'yes.'"

### Slide 4: Fundamentals are king
> "Before any tool: **fundamentals are king.** Learn the fundamentals of what you're building, so you actually know what the code does and what 'good' looks like. Tools change every month, fundamentals don't. You can't direct what you don't understand."

### Slide 5: The loop
> "Here's the whole workflow. **Spec**, say what done means. **Plan**, let it propose steps, you approve. **Develop**, small steps, run it each time. **Review**, read the diff, accept only what you understand. And it all runs on a foundation: a `CLAUDE.md` of rules, small commits, run it every step, never merge what you can't explain."

### Slide 6: Slop vs quality
> "Everyone's scared of 'AI slop.' Here's where it comes from." *(walk the slop column)* "And here's the cure." *(walk the quality column)* "The difference is whether you stay in command of intent, steps, and review."

### Slide 7: The anti-slop formula
> "Memorize this: **specify, constrain, chunk, scrutinize.** Slop is vibes divided by hope. The punchline, **AI gives you a draft, not a decision.** You make the decision."

### Slide 8: Demo 1 (same page, two prompts)
> "Let me prove that last point." → **Run DEMO 1 here (see § 3).** Come back to the deck afterward and continue with Skills.

### Slide 9: Skills (optional: build one LIVE)
> "Here's my favorite feature. A **skill** is just a folder with a `SKILL.md` file, packaged know-how you teach Claude once and reuse forever. The magic is the **description**: that's how Claude decides, on its own, when to reach for it. You can also fire one with `/name`."

**OPTIONAL, LIVE skill creation** (≈90 seconds; the slide is concept-only, so do this only if you have time and want a quick demo). In your terminal with Claude Code running:

```
Create a skill called "commit-msg". Make the file .claude/skills/commit-msg/SKILL.md with YAML frontmatter (name + a description that says to use it when writing a git commit message), then markdown instructions: imperative mood, under 50 chars on the subject line, explain WHY not what, and no AI attribution. Keep it short.
```

> *Say while it writes:* "That's it, a name, a description so Claude knows when it applies, and the instructions. Next time I ask for a commit message, Claude reaches for this automatically." *(Optionally open the file and read the 6 lines aloud.)*

**Fallback if you'd rather not type live:** just open an existing skill file and read its frontmatter, the point is the `name` + `description` + instructions shape.

### Slide 10: Claude for everyone
> "And this isn't just for programmers. Spreadsheets, PDFs, resumes, emails, research, same loop: spec, plan, develop, review. If you can describe what 'done' looks like, you can do this. **Skills for everyone.**"

---

## 3. DEMO 1: Same page, two prompts (slide 8, ~5 min)

A fast, visual proof of the anti-slop formula: the **same hero landing page, described two ways.** **Pre-build both before the talk**, don't build this live (React + Vite + Tailwind + video is too slow). Show the prompts, then the two results side by side.

**Before the talk**, generate both from the prompts in `demos/demo-1-two-prompts/` (output into `output/two-prompts/`):
- `hero-advance-prompt.md` → a hyper-specific spec (exact Tailwind classes, pixel values, animation timings) → `output/two-prompts/advance`
- `hero-normal-words.md` → the same page in plain-English sentences → `output/two-prompts/normal`

Have both running in browser tabs (screenshots as backup).

### ▸ On the night
*Say: "Do you need to talk like a programmer to get a great result? Same page, two prompts, let's see."*

1. **Show the two prompts**, open both `.md` files split-screen. Point: one is an exact spec, the other is plain sentences. Don't show code, show how different the *inputs* read.
2. **Reveal both rendered pages, side by side.** Let the difference land for a beat.
3. *Say: "Same intent, two results. Everything that differs is something the looser prompt didn't say, so the AI decided for me. Precision isn't bureaucracy; it's control."*
4. **Tie back to slide 7:** "That's `specify · constrain` in the wild. The more precisely you say what done means, the less the AI guesses. **You're in command, or it is.**"

> The spectrum: a vague one-liner ("make a cool dev landing page") → a detailed plain-English brief → a hyper-specific spec. Quality climbs as you specify more. You don't need jargon to be precise, you need to say what you actually want.

> After the demo, return to the deck at **slide 9 (Skills)** and continue.

---

## 4. DEMO 2: The live build (Streak, the workflow) (slide 11, ~24 min)

Open a terminal beside the deck. **Set the guardrails BEFORE you prompt anything**, that's the whole point.

### ▸ STEP 0: Set the guardrails FIRST
*Say: "Before I ask for a single line of code, I set the rules. Right now the only thing in my folder is a `CLAUDE.md`, the constraints I'm handing the AI. Claude Code reads this automatically on every prompt."*

```
cd ~/Documents/demo-intro/demo-kit/output/streak
cp ../../demos/demo-2-streak/CLAUDE.example.md ./CLAUDE.md
cat CLAUDE.md      # put it on screen
claude
```

**The simple `CLAUDE.md` (read this on screen):**

```markdown
# Streak: a habit tracker

## What we're building
Add habits, mark them done today, see a streak, delete them. Everything saves on refresh.

## Stack (do not change without asking)
React + Vite + Tailwind. localStorage for saving. No backend, no accounts, no new dependencies.

## How we work
- Small steps. After each one, tell me how to run and verify it.
- Ask before coding if anything is unclear, don't guess.
- Don't add features I didn't ask for. Suggest them instead.
- Nothing is "done" until I confirm it works.

## Done = the MVP
1. Add a habit  2. Toggle "done today"  3. Show streak "N"  4. Delete a habit  5. Persists on refresh

## Don't build (unless I ask)
Accounts, sync, charts, reminders, categories, notifications.
```

Walk through the key rules out loud: fixed stack, no surprise dependencies, small steps, ask-before-guessing, and the out-of-scope list. *Then* start prompting.

> This short version lives at `demos/demo-2-streak/CLAUDE.example.md` (the longer original is `demos/demo-2-streak/CLAUDE.md.example`). Adjust the `cp` path if your folders differ.

Then run the loop **twice**, two full flows, each one: `/brainstorming` → `/plan` → `/develop` → `/request-code-review`.

> These are superpowers slash commands and they ARE the deck's loop: `/brainstorming` (explore + spec), `/plan` (turn the spec into steps), `/develop` (execute, small steps), `/request-code-review` (verify). Flow 1 builds the MVP; Flow 2 reruns the exact same four beats for a new feature, that's why we brainstorm twice.

---

## FLOW 1: Core MVP (~17 min)

### ▸ 1A · `/brainstorming`: spec it together
*Say: "I don't start by asking for code. I start a brainstorm, it interviews me, and we agree on a spec before anything gets built."*

Type `/brainstorming`, then paste this seed so the session has real substance:

```
Help me spec a small habit tracker called "Streak". Constraints are in CLAUDE.md (React + Vite + Tailwind, localStorage, no backend). The whole MVP:
1. Add a habit by name.
2. A "done today" toggle per habit.
3. Current streak per habit, consecutive days done, ending today, shown as "N".
4. Delete a habit.
5. Persists across refresh.
Data model: array of habits, each { id, name, history } where history maps "YYYY-MM-DD" → true.
Streak rule: count back from today through consecutive true days; if today isn't done yet, show the run through yesterday.
Keep it simple and readable. Ask me anything ambiguous before we settle the design.
```

*Answer its questions out loud, that's the "stay in command" moment. Let it land a short design/spec.*

### ▸ 1B · `/plan`: turn the spec into steps
*Say: "Now I turn the agreed spec into a plan I can approve, before a line of code."*

```
/plan
```
*(It produces a step-by-step implementation plan from the spec. Read it, approve it, or tweak one step live.)*

### ▸ 1C · `/develop`: build it in small steps
*Say: "Now it executes the plan, small steps, and I run it after each one."*

```
/develop
```
*(Run the commands it gives. Open `localhost:5173`. Add a couple habits, refresh to show they persist, toggle one done to show the streak hit 1, delete one. Narrate each verify.)*

### ▸ 1D · `/request-code-review`: verify before you trust it
*Say: "Never merge what you can't explain. I ask for a review and read the core logic myself."*

```
/request-code-review
```
*(Have it walk you through `computeStreak` line by line. Push back on one thing, "why this, not that?", to model healthy skepticism.)*

---

## FLOW 2: Add a feature (~8 min, same four commands, faster)

*Say: "That's one full loop. Real work is loops on loops, so let's run the exact same flow again for a new feature."*

Default feature: a **7-day history grid** per habit (swap for dark mode or an audience request if you prefer).

### ▸ 2A · `/brainstorming`
```
/brainstorming
```
Seed:
```
Add one feature to Streak: a 7-day grid per habit showing which of the last 7 days were marked done (most recent on the right). Same constraints as CLAUDE.md, no new dependencies. Spec it with me, then we'll plan and build.
```

### ▸ 2B · `/plan`  →  2C · `/develop`  →  2D · `/request-code-review`
*Run the same three commands, faster, the point is to show the loop is repeatable, not to dwell.*

```
/plan
/develop
/request-code-review
```
*(Show the grid filling in as you toggle days. Quick review, then stop.)*

> **Manual fallback** (if a slash command misbehaves live): just say the beat in plain English, "spec this with me", "give me a plan first", "build step one and tell me how to verify", "summarize what changed and explain the streak logic." The commands are shortcuts for those sentences.

---

## 5. CLOSE (slide 12, ~6 min)

> "That's the whole loop: spec, plan, develop, review, on a foundation of fundamentals. The app is throwaway. The *workflow* is the thing you keep. You're in command, now go start building."

- Switch to slide 12 ("Start building."). Point at the two QR codes.
> "Left QR: 2-minute feedback form, please be honest, it makes the next one better. Right QR: totally optional, if this was useful, buy me a beer."
- Open the floor: **"What do you want me to build or break next? Ask me anything."**

---

## 6. ONE-LINERS TO KEEP IN YOUR BACK POCKET
- "AI gives you a draft, not a decision."
- "You're in command."
- "Confident even when it's wrong."
- "Tools change. Fundamentals are king."
- "Never merge what you can't explain."
- "Small steps, run it every time."

---

## 7. RECORDING & SCREEN-SHARE (Windows + OBS)

**Topology (no files to move):** The live demo runs inside the **Linux VM**, deck, terminal, and Claude Code are already there. On the **Windows host** you run OBS (records screen + your face) and Google Meet (shares your screen). OBS captures everything on screen, including the VM window and the Meet call.

### iPhone as webcam (Windows has no Continuity Camera; needs an app)
1. iPhone: install **Camo** (recommended) or **iVCam** from the App Store.
2. Windows: install the matching desktop app (reincubate.com/camo or e2esoft iVCam).
3. **Connect via USB** (more reliable than Wi-Fi for a live talk). Trust the computer.
4. Verify: open the Windows **Camera** app → your iPhone feed should appear. (Free tiers are fine for a small corner overlay; minor watermark/res limits don't matter at that size.)

### OBS scene (one-time, ~5 min)
1. **Settings → Output → Recording:** Format `mp4`, Quality "High". **Settings → Video:** Base + Output resolution = your screen res, 30 FPS. **Settings → Audio:** select your mic.
2. **Sources → + Display Capture** → pick your monitor. (This grabs the VM window + Meet.)
3. **Sources → + Video Capture Device** → select Camo / iVCam → drag & resize it into a **bottom corner**. Keep it small so it never covers the terminal or code.
4. Big red **Start Recording** → saves a local `.mp4` (Settings → Output shows the folder). **Stop Recording** when done.

### Google Meet
Share your **whole screen** (or just the VM window). Don't bother with Meet's built-in recording, OBS already captures everything, free.

### Dry-run recording checklist (tonight, on Windows)
- [ ] iPhone webcam app installed both sides; iPhone shows in the Windows **Camera** app.
- [ ] OBS scene built; **face overlay in a corner**, not over code.
- [ ] **Mic works**, talk and watch the OBS audio meter move.
- [ ] **Record 60 seconds** of clicking through the deck + typing in the VM terminal, then **play it back**: face visible, text readable, audio in sync.
- [ ] Free disk space for ~1–2 GB per hour.
- [ ] **If Display Capture is black:** change the capture method in the source's properties, or run OBS as Administrator.
- [ ] **If the VM window is laggy under OBS:** lower OBS output to 1080p / 30fps; close other apps.
