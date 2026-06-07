# Mova

A real-time multiplayer word tile game for 2–4 players. Create a room, share a link, and play Scrabble-style in the browser — no account needed.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, shadcn/ui (base-luma) |
| Drag & drop | dnd-kit |
| Realtime | PartyKit (WebSockets) |
| Routing | React Router v7 |
| i18n | i18next |

## Architecture

```
browser (React)  ←——WebSocket——→  PartyKit server (party/index.ts)
```

**Client** manages UI state: tile assignments, drag interactions, local session.

**Server** (`party/`) is the source of truth for all game state — it owns the bag, racks, board, scores, and turn order. Clients never mutate game state directly; they send messages and receive authoritative state back.

### Message flow

| Direction | Message | When |
|---|---|---|
| client → server | `READY` / `UNREADY` | Player toggles ready in lobby |
| client → server | `SUBMIT_TURN` | Player submits placed tiles |
| server → client | `ROOM_STATE` | Player joins or leaves |
| server → client | `GAME_START` | All players ready |
| server → client | `RACK_STATE` | Game start or after turn |
| server → client | `BOARD_STATE` | After each valid turn |
| server → client | `TURN_CHANGE` | After each valid turn |
| server → client | `SUBMIT_ERROR` | Invalid placement |
| server → client | `GAME_OVER` | Bag empty, rack empty |

### Key files

```
party/
  index.ts          — PartyKit entry: onConnect, onClose, onMessage
  lib/gameState.ts  — All game logic (pure class, no I/O)
  lib/validation.ts — Placement rules (line, gaps, connectivity)
  lib/bag.ts        — Tile bag: build, shuffle, draw, refill

src/
  hooks/game/useGameSession.ts   — WebSocket connection + state for game
  hooks/room/useRoomSession.ts   — WebSocket connection + state for lobby
  hooks/game/useTileAssignment.ts — Local drag state: rack ↔ board
  pages/Game.tsx                 — Game screen, drag context, submit
  pages/Room.tsx                 — Lobby screen
```

## Getting Started

**Prerequisites:** Node.js 18+, npm

```bash
npm install
npm run dev:all     # starts Vite (localhost:5173) + PartyKit (localhost:1999)
```

Open `http://localhost:5173` in two browser tabs to test multiplayer locally.

## Features

- Create a room and share a 6-char link — auto-copied to clipboard
- Join via shared link or by typing a room code
- Lobby with player list and ready/unready toggle — game starts when all are ready
- 15×15 board with premium squares (DL, TL, DW, TW) and center marker
- 7 tiles per player, visible only to their owner; rack refills from the bag after each turn
- Drag tiles from rack to board, snap to cell, drag back or hit Clear to undo
- Server-side validation: straight line, no gaps, connected to board, first move covers center
- Specific error toast for each invalid case; tiles stay placed so you can adjust
- Real-time turn indicator and scores for all players
- Game over screen with winner, tie, or loser and final scores

## Roadmap

- Lobby waiting state ("Waiting for opponent...", "Opponent left")
- Visually distinct empty vs occupied board cells
- Dictionary word validation
- Mobile touch support
- Tile swap
- Blank tiles
