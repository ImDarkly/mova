# mova

Real-time multiplayer word tile game for 2–4 players — create a room, share a link, play Scrabble-style in the browser, no account needed.

## Commands

- dev: `npm run dev:all` (Vite on :5173 + Wrangler/PartyServer on :1999) — `npm run dev` for frontend only
- verify: `npm run verify` (lint + typecheck + build)
- tests: none yet

## Rules

1. One goal per session. Goal done = commit, report, stop.
2. Run `npm run verify` before every commit. Never commit red.
3. Small commits: one logical change, message says what and why.
4. No refactoring outside the goal. Spot something? Note it in the report, move on.
5. Same error twice = stop and report. Don't loop repairs.
6. Harness/tooling goals never touch app code.
