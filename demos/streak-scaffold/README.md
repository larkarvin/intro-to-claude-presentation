# Streak scaffold

A blank React + Vite + Tailwind app, pre-set so the live demo skips the slow scaffold/install.

## Use it (before the talk)

Copy it OUTSIDE this repo so Claude Code only sees the app (not the kit's other files), then install once:

```
cp -r demos/streak-scaffold ~/streak-live
cd ~/streak-live
npm install
npm run dev    # confirm the blank "Streak" page loads at localhost:5173
```

`CLAUDE.md` travels with the scaffold, so the guardrails are already in place. On the night, start `claude` in `~/streak-live` and run the loop to build features into the running app.
