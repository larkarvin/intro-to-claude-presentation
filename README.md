# Vibe Coding with Claude Code

![Title slide of the presentation](docs/preview.png)

> **An intro session by Karl Arvin Almario. A free community jam, not a course.**

## The story

A college friend asked me to teach her **vibe coding**: building software by directing an AI instead of typing every line. Instead of teaching just one person, I figured, why not open it up? So this became a free, informal intro session for **anyone** who's curious, beginners especially welcome.

This repo is the whole kit I used to run it: the slide deck, the run-of-show, and the two live demos. It's here so you can **watch the workflow, reuse the materials, or run your own session.**

The one idea the whole talk hangs on: **you're in command.** The AI is a fast, tireless assistant, but it's confidently wrong sometimes, so you stay the author. Plan it, guard it, verify it.

## The session

- **What:** A live intro to AI-assisted development with [Claude Code](https://www.claude.com/product/claude-code). My real workflow, mistakes and all.
- **Who it's for:** Beginners and the curious. No experience needed; if you've never opened a terminal, you're exactly who this is for.
- **When:** Sat 27 June 2026, 8:00 PM (Asia/Manila) · **Where:** Google Meet.
- **Format:** ~20 min of framing, then two live builds. *Demo 1* shows how the **prompt** changes the result; *Demo 2* builds a habit tracker live using the full **spec → plan → develop → review** loop.

## The poster

The invite that went out:

![Event poster](docs/poster.jpeg)

![Event poster, LinkedIn version](docs/poster-linkedin.jpeg)

> **Funny tidbit:** the version posted on LinkedIn proudly announces **2025**. The event is actually in **2026**. It shipped before anyone verified the date. A very on-brand "read the diff before you ship it" moment, which is, ironically, the entire point of this talk. We are calling it the vintage edition.

## What's inside

- **[`SCRIPT.md`](SCRIPT.md)**: the full run-of-show and speaker notes. Timing, what to say per slide, the exact demo prompts, and the guardrails-first approach. Start here if you want to run it yourself.
- **`slides/`**: the presentation, as a single self-contained HTML file (two themes).
- **`demos/`**: the source material for both live demos.

## Structure

```
demo-kit/
├── README.md                       ← you are here
├── SCRIPT.md                       ← talk script & run-of-show (start here)
│
├── slides/                         ← the presentation decks (open in a browser)
│   ├── intro-claude-presentation.html      ← main deck (typography theme)
│   ├── intro-claude-terminal-theme.html    ← alternate deck (terminal theme)
│   ├── presentation-prompt.md              ← the prompt used to generate the deck
│   └── assets/
│       ├── qr-feedback.png
│       ├── qr-beer.png
│       └── regen-qr.py                     ← edit URLs + run to regenerate the QRs
│
├── demos/                          ← source material for the two live demos
│   ├── demo-1-two-prompts/         ← Demo 1: same page, two prompts
│   │   ├── hero-advance-prompt.md          ← hyper-specific spec
│   │   └── hero-normal-words.md            ← same intent, plain-English
│   └── demo-2-streak/              ← Demo 2: the workflow (live build)
│       ├── CLAUDE.example.md               ← simple guardrails (used on the night)
│       └── CLAUDE.md.example               ← longer, detailed guardrails
│
└── output/                         ← generated apps land here (build later)
    ├── two-prompts/                ← advance/ and normal/ hero pages (Demo 1)
    └── streak/                     ← the live-build app (Demo 2)
```

## Quick start

1. **Present:** open `slides/intro-claude-presentation.html` → press **F** for fullscreen, **← / →** to navigate.
2. **QR links:** edit the two URLs in `slides/assets/regen-qr.py`, run `python3 slides/assets/regen-qr.py`, refresh the deck.
3. **Pre-build Demo 1:** generate both hero pages from `demos/demo-1-two-prompts/` into `output/two-prompts/` (see `SCRIPT.md` § 3).
4. **Run Demo 2 live:** copy `demos/demo-2-streak/CLAUDE.example.md` into `output/streak/` as `CLAUDE.md`, then build (see `SCRIPT.md` § 4).
