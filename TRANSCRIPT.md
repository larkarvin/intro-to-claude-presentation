# Meeting Transcript: Vibe Coding with Claude Code

**Session date:** 27 June 2026
**Presenter:** Karl Arvin Almario
**Attendees:** 20+
**Recording:** https://youtu.be/A7kqhxOaj1Y

## Overview

Arvin Almario presented an introductory session on using Claude Code for "vibe coding," focused on the "Plan, Guard, Verify. You Direct, AI Writes" loop. He demonstrated a hands-on habit-tracker (Streak) build workflow. The session included live demos of prompt design (vague vs. advanced), skill creation, planning and executing code via Claude (including parallel sub-agents), and review practices covering both automated and manual verification.

## Key points and takeaways

Core message: "Plan, Guard, Verify. You direct, the AI writes." Arvin emphasized that the human remains the director (prompter) and must specify constraints and verify outputs, because AI can hallucinate.

Fundamentals matter: learn the underlying technologies (for example React, Tailwind) even when using AI-assisted coding. Tools change but fundamentals do not.

The loop (workflow) introduced:

- **Specify:** define clear specs, constraints, guardrails, and a Definition of Done.
- **Plan:** convert specs into an actionable plan or checklist (small executable steps).
- **Develop:** small iterative steps, run and refine. Can spawn parallel sub-agents to speed implementation.
- **Review:** inspect output, request code review, iterate until accepted.

## Demonstrations and technical details

Two prompt examples generated the same landing page: a "normal" (vague) prompt and an "advanced" prompt with explicit styling, fonts, padding, icons, background video, and exact layout requirements. Result: the advanced prompt produced more predictable, polished output.

Demonstrated Claude Code in the terminal (preferred over the browser for persistent file creation) and showed how Claude can create files directly on the user's machine when given permission.

Models and cost/effort trade-offs:

- **Opus:** highest thinking capability, best for brainstorming and spec creation, but consumes many tokens.
- **Sonnet:** balanced for mechanical tasks and routine execution.
- **Haiku:** very fast and smallest model, used rarely.

Effort setting influences quality and time: higher effort is slower but smarter, and uses more tokens. Recommended default: medium. Use Opus for thinking and Sonnet for routine jobs.

Token and usage notes:

- Tokens consumed depend on prompt length, complexity, and the model.
- Subscription plans provide limits (Arvin referenced a Pro account and example usage statistics).
- Slash commands exist to inspect token usage.
- Context compression and optimization (caveman style, Headroom referenced) can reduce token use, with caution about readability and personal preference.

## Skills and reuse

Skills are saved prompts (Markdown files) that can be reused to avoid retyping frequent prompts. Examples: `/commit` to remove Claude attribution, `/showme` to display token usage, and a "grill me" interview skill to get a detailed spec.

"Superpowers" skill pack: a recommended collection to support the loop (brainstorm and spec creation, writing plans, developer tasks, review). These enable better structure and agent-driven workflows.

Suggestion: create skills for repeated tasks (committing code, generating PR reviews, scaffolding).

## Streak (habit-tracker) project: flow and decisions

Goal: build a local-only single-page Habit Tracker MVP (no backend) with features:

- Add habits, mark done for "today," display streak as a fire emoji, delete habits.
- Persistence via browser localStorage (survive refresh).
- Dev-only date simulator (calendar and +1-day jump) to test streak logic without waiting real days.

Definition of Done and guardrails: "Do not change without asking." Do not implement accounts, reminders, categories, or charts in the MVP.

Specification highlights written by Claude:

- Data model: habit object with id (UUID), title, and a doneDates array (dates when the habit was marked done).
- Streak computation: consecutive days up to today. Pressing Done for today appends today's date. Missing a day clears the streak. Option to simulate or skip days for development.
- Components and data flow defined at a high level (no low-level implementation details in the spec).

Implementation approach:

- Claude generated an implementation plan from the spec, then executed tasks (files, UI, storage), possibly in parallel using sub-agent-driven development.
- Arvin prepared scaffolding and some pre-installed libraries to speed the demo.

Results of the demo:

- The built UI supported adding habits, marking done, calendar simulation (+1 day or jump), reset to real today, and clearing streak on a skipped day.
- Some minor visual and layout issues were identified (for example stats outside view, heading overlap) to be iterated on.

## Verification and review

Emphasized iterative verification after each develop step: run the server, open the browser, visually inspect, test interactions, and ask for revisions.

Code review process:

- Claude can run an automated code review against specs and plans. Arvin demonstrated requesting a code review.
- Arvin uses prompt-based review templates to produce ranked findings (critical, medium, low) and suggested fixes.

Versioning and committing: integrate changes into a code repository with commits, diffs, and PR-style reviews. Arvin keeps prompts that remove Claude attribution when committing (the slash commit skill).

Visual testing: Claude can drive a headless Chrome and take screenshots for UI debugging. Prompts can request screenshots and automated browser checks when configured.

## Operational cautions and best practices

- Permissions: granting full file access can be powerful but risky (Arvin warned of accidental deletions). Prefer explicit confirmations unless you know what you are doing.
- A clear Definition of Done prevents endless loops of revisions and ambiguity.
- Use context management: clear session context after finishing a feature to avoid token bloat and stale context. Persist important context in a project memory file for reuse across sessions.
- When you reach large context sizes, create handover prompts or compressed summaries to bootstrap new conversations (Marc suggestion; Garri and others used caveman and breakdown techniques).

## Tools, integrations, and ecosystem

Claude Code integrations discussed or referenced:

- Local terminal usage (preferred for persistent file creation).
- Cloud app browser and phone UI (screenshots and interactive browser automation support).
- Figma and ClickUp: Claude used for design-to-code automation and project management automation.
- Possible integrations mentioned: ClickUp, Figma, MCP, Atlassian, Kibana, Argo (some participants asked if Claude can connect; Arvin confirmed many integrations are possible).

Community resources referenced:

- Superpowers skill collection.
- Garry Tan's gstack (similar community resource).
- Headroom repository (context optimization), link shared by Gerald: https://github.com/headroomlabs-ai/headroom

## Questions raised and short answers

- **How to start with Claude Code or subscription?** Arvin: register for Claude Code (example Pro account cost references), pay for limits. Subscription provides token limits and reset cycles. Slash usage can show token consumption.
- **How are tokens measured?** Token usage depends on prompt length, complexity, and model. Opus consumes more tokens; Sonnet less.
- **Can Claude take screenshots or drive a browser?** Yes, via headless Chrome in the Cloud app. It can capture screenshots for visual bug reporting.
- **Is context optimization (Headroom) safe?** Participants raised Headroom and caveman techniques. Arvin discussed caveman style but cautioned about readability. The Headroom link was shared for investigation.
- **Can Claude work with other models (Codex, OpenAI)?** Yes. Workflow ideas can be applied to other LLMs; choose model per task.
- **Can Claude be used for code review?** Yes. Arvin demonstrated an automated code review that checks spec and plan conformance and highlights issues.

## Action items and follow-ups

- Arvin will share presentation materials, prompts, scaffold, and demo outputs on his GitHub (includes advanced and normal prompts, slide deck, and the Streak scaffold).
- Attendees were encouraged to try sample prompts, install superpowers, and experiment with skills for repeated tasks.
- Suggested next steps for attendees: practice writing precise specs and plans, create reusable skills for repetitive prompts, and try the Streak scaffold to experience the specify, plan, develop, review loop.

## Notable quotes (condensed)

- "Plan, Guard, Verify. You direct, AI writes."
- "You cannot direct what you don't understand."
- "Define the finish line. The Definition of Done."
