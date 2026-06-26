# Vibe Coding with Claude Code: Talk Script & Run-of-Show

**When:** Sat June 27, 8:00–9:00 PM (Asia/Manila) · **Where:** Google Meet
**Deck:** open `slides/intro-claude-presentation.html`, press **F** for fullscreen, **→ / ←** to navigate.
**Setup, recording, and the full build prompts:** see [PREP.md](PREP.md).

> Golden rule for the whole hour: **you're in command.** Narrate your *thinking*, not just your typing. If something breaks, say "great, this is the real workflow" and debug it out loud. That IS the lesson.

---

## 0. OUTLINE (the 30-second mental map)

1. **Hook** *(slide 1)*: "I'm not going to write code tonight. I'm going to direct it." (2 min)
2. **Frame** *(slide 2)*: what this is, who it's for. (3 min)
3. **The big idea** *(slide 3)*: you're in command. (3 min)
4. **Fundamentals are king** *(slide 4)*: learn what your code does. (2 min)
5. **The workflow** *(slide 5)*: spec → plan → develop → review. (4 min)
6. **Slop vs quality** *(slide 6)* + **the anti-slop formula** *(slide 7)*. (4 min)
7. **DEMO 1: same page, two prompts** *(slide 8)*: specific vs vague. (5 min)
8. **Skills** *(slide 9)* + **Claude for everyone** *(slide 10)*. (5 min)
9. **DEMO 2: the workflow on a finished build** *(slide 11)*: show Streak, then verify it live. (10 min)
10. **End card** *(slide 12)*: feedback + beer QR + Q&A. (6 min)

Total ≈ 44 min. Two demos: **Demo 1** = *the prompt* matters (pre-built, shown); **Demo 2** = *the workflow* matters (finished build + live review).

---

## 1. SLIDE-BY-SLIDE TALK TRACK (framing, ~20 min)

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
> "Let me prove that last point." → **Run DEMO 1 here (see § 2).** Come back to the deck afterward and continue with Skills.

### Slide 9: Skills
> "Here's my favorite feature. A **skill** is just a folder with a `SKILL.md` file, packaged know-how you teach Claude once and reuse forever. The magic is the **description**: that's how Claude decides, on its own, when to reach for it. You can also fire one with `/name`."

*(Optional, ~90s live)* Type this to make one on the spot:
```
Create a skill called "commit-msg". Make .claude/skills/commit-msg/SKILL.md with YAML frontmatter (name + a description that says to use it when writing a git commit message), then markdown instructions: imperative mood, under 50 chars on the subject line, explain WHY not what, no AI attribution. Keep it short.
```
> *Say while it writes:* "A name, a description so Claude knows when it applies, and the instructions. Next time I ask for a commit message, it reaches for this automatically." Fallback: open an existing skill file and read its frontmatter.

### Slide 10: Claude for everyone
> "And this isn't just for programmers. Spreadsheets, PDFs, resumes, emails, research, same loop: spec, plan, develop, review. If you can describe what 'done' looks like, you can do this. **Skills for everyone.**"

---

## 2. DEMO 1: Same page, two prompts (slide 8, ~5 min)

A fast, visual proof of the anti-slop formula: the **same hero landing page, described two ways.** Pre-built before the talk (see PREP); show the prompts, then the results.

*Say: "Do you need to talk like a programmer to get a great result? Same page, two prompts, let's see."*

1. **Show the two prompts** side by side (the two `.md` files). One is an exact spec, the other is plain sentences. Don't show code, show how different the *inputs* read.
2. **Reveal both rendered pages.** Let the difference land for a beat.
3. *Say: "Same intent, two results. Everything that differs is something the looser prompt didn't say, so the AI decided for me. Precision isn't bureaucracy; it's control."*
4. **Tie back to slide 7:** "That's `specify · constrain` in the wild. The more precisely you say what done means, the less the AI guesses. **You're in command, or it is.**"

> The spectrum: a vague one-liner → a detailed plain-English brief → a hyper-specific spec. Quality climbs as you specify more. You don't need jargon to be precise, you need to say what you actually want.

Then return to the deck at **slide 9 (Skills)**.

---

## 3. DEMO 2: The workflow on a finished build (slide 11, ~10 min)

A full live build is ~12 minutes of mostly silent generation, so you are **not** building live. Show the finished Streak, show the conversation that built it, then run **`/request-code-review`** live, the one step that's fast, visual, and lands the "verify, you're in command" beat. App is at `~/streak-live-for-review`.

### ▸ STEP 1: Show the finished app
*Say: "I built this with the exact loop on the last slide. Here it is working."*
```sh
cd ~/streak-live-for-review
npm run dev        # Streak at localhost:5173
```
Demo it: add a couple habits, toggle one done (streak goes to 1), refresh to show it persists, delete one. Lead with the payoff.

### ▸ STEP 2: Show how I built it
*Say: "Here's the actual conversation. Guardrails first, then spec, plan, develop, review."*
```sh
claude --resume    # pick the build session; it reprints the conversation
```
Scroll the brainstorm → plan → develop exchanges. Also point at:
- `CLAUDE.md` — the rules I handed it.
- `git log --oneline` — small commits, one per step (the "small commits" fundamental, live).

### ▸ STEP 3: Verify it live with `/request-code-review`
The only thing you run live, and the heart of "you're in command." In the resumed session:
```
/request-code-review
```
*Say: "Never merge what you can't explain. I didn't write this, so I review it like a teammate's PR."* Have it walk you through `computeStreak` (`src/lib/streak.js`); push back on one thing. While it runs, **take an audience question** rather than watching silently.

**If someone asks "why isn't it asking permission?"** Be honest: *"I've turned the safety prompts off (`--dangerously-skip-permissions`) so the demo flows. Normally Claude asks before each command or edit, and that approval is the guardrail. I skip it because I'm watching live, but I wouldn't recommend it for beginners."*

> Full build prompts (brainstorm/plan/develop seeds, model choice, dead-air tips) are in [PREP.md § 3](PREP.md).

---

## 4. CLOSE (slide 12, ~6 min)

> "That's the whole loop: spec, plan, develop, review, on a foundation of fundamentals. The app is throwaway. The *workflow* is the thing you keep. You're in command, now go start building."

- Switch to slide 12 ("Start building."). Point at the two QR codes.
> "Left QR: 2-minute feedback form, please be honest, it makes the next one better. Right QR: totally optional, if this was useful, buy me a beer."
- Open the floor: **"What do you want me to build or break next? Ask me anything."**

---

## 5. ONE-LINERS TO KEEP IN YOUR BACK POCKET
- "AI gives you a draft, not a decision."
- "You're in command."
- "Confident even when it's wrong."
- "Tools change. Fundamentals are king."
- "Never merge what you can't explain."
- "Small steps, run it every time."
