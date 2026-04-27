# Kids Learning Game — Design Spec

**Date:** 2026-04-24
**Audience:** Children ages 5-7
**Deliverable:** Single-file HTML game (runs offline in any modern browser)

## Purpose

A browser-based educational game that helps young children strengthen four cognitive skill areas through age-appropriate mini-games:

1. **Memory** — recall and recognition
2. **Pattern Recognition** — sequence and visual pattern detection
3. **Puzzles** — spatial reasoning and piece-fitting
4. **Logic & Critical Thinking** — classification and categorization

The game also incorporates **early reading practice** (letter and word recognition) through dedicated modes within the Memory and Pattern Recognition games.

## Design Principles

- **Click/tap only** — no drag-and-drop (fine motor skills vary widely at ages 5-7)
- **Icon-first UI** — minimal text on controls; emoji and shapes over labels
- **Immediate positive feedback** — every correct answer gets visual celebration
- **Gentle failure** — no scary sounds or red X; wrong answers just don't stick, with a "try again" cue
- **Warm, inviting palette** — cream, soft coral, warm yellow, peach, sage green (no harsh whites or cold blues)
- **Self-contained** — one HTML file, no build step, no network requests, no dependencies

## The Four Mini-Games

### 1. Memory — "Match the Pairs"

Classic card-flip memory game on a grid of face-down cards.

**Modes (child selects):**
- **Picture ↔ Picture** — match identical emoji pairs (🐱 ↔ 🐱)
- **Picture ↔ Word** — match a word card to its matching picture card (CAT ↔ 🐱)

**Difficulty scaling:**
| Level  | Grid       | Word length (Word mode) |
|--------|------------|-------------------------|
| Easy   | 2×3 (6 cards, 3 pairs)   | 3 letters (CAT, DOG, SUN) |
| Medium | 3×4 (12 cards, 6 pairs)  | 4-5 letters (BALL, APPLE, HOUSE) |
| Hard   | 4×5 (20 cards, 10 pairs) | 6-7 letters (FLOWER, ORANGE, RAINBOW) |

**Interaction:**
- Click first card → it flips
- Click second card → it flips
- Match: both stay face-up with a gentle "ding" and sparkle animation
- No match: brief pause, then both flip back
- Win: all pairs matched → celebration screen with stars

### 2. Pattern Recognition — "What Comes Next?"

Shows a sequence with one blank slot at the end. Child picks the correct item from 3-4 options below.

**Sub-games (child selects):**
- **Shapes** — geometric shapes (dot, triangle, square, hexagon, star, circle, diamond) in repeating or growing patterns (🔺⬜🔺⬜❓)
- **Letters & Numbers** — mixed alphanumeric sequences (A 1 B 2 C ❓ → 3; A B C ❓ → D)
- **Words** — repeating word patterns (CAT DOG CAT DOG ❓ → CAT)

**Difficulty scaling:**
| Level  | Pattern length | Pattern type |
|--------|----------------|--------------|
| Easy   | 4 items shown  | Simple ABAB repeat |
| Medium | 6 items shown  | ABCABC or growing (A, AB, ABC) |
| Hard   | 7-8 items shown | ABCDABCD, mixed, or embedded sub-patterns |

**Interaction:**
- Sequence displayed in a row with a `?` box at the end
- 3-4 option buttons below
- Click an option → if correct, it slots into the `?` box with a sparkle
- If wrong, the option briefly dims and shakes; child tries again
- 5 correct patterns in a row = level complete

### 3. Puzzles — "Missing Piece"

A large emoji or simple SVG picture (animal, vehicle, house, etc.) is shown with one shaped piece "cut out" as a blank silhouette. Child picks the correct piece from options below to complete the picture. Pictures are rendered as large emoji inside an SVG viewport, with the "missing piece" implemented as a transparent shaped cutout overlay — this keeps the file self-contained and avoids needing bundled image assets.

**Difficulty scaling:**
| Level  | # of options | Piece distinctiveness |
|--------|--------------|----------------------|
| Easy   | 3 options    | Very different pieces (obvious choice) |
| Medium | 4 options    | Two similar, two distinct |
| Hard   | 5 options    | All visually similar, requires close inspection |

**Interaction:**
- Picture shown with a blank shaped cutout
- Options shown below as clickable tiles
- Click correct piece → it animates into place, picture completes with celebration
- Click wrong piece → piece shakes and dims briefly
- 5 puzzles completed = level complete

### 4. Logic & Critical Thinking — "Odd One Out"

Shows 4 items; child clicks the one that doesn't belong to the group.

**Categories rotate:**
- Animals vs non-animals (🐶🐱🐰🚗)
- Food vs non-food
- Colors (3 warm + 1 cool, or 3 of same hue + 1 different)
- Shapes (3 round + 1 angular, etc.)
- Sizes (3 big + 1 small)

**Difficulty scaling:**
| Level  | Distinction | Category signal |
|--------|-------------|-----------------|
| Easy   | Very obvious (dog among fruit) | Single clear dimension |
| Medium | Requires thinking (3 mammals + 1 bird) | Sub-category distinction |
| Hard   | Subtle (3 things that fly + 1 that doesn't) | Abstract attribute |

**Interaction:**
- 4 items displayed in a 2×2 grid
- Click the odd one → if correct, it flies away, others celebrate
- Wrong click → item shakes and dims briefly
- 5 correct = level complete

## UI Layout

```
┌──────────────────────────────────────────────┐
│  [🧠 Memory] [🎨 Pattern] [🧩 Puzzle] [🦉 Logic]  │  ← Top game selector
├──────────────────────────────────────────────┤
│  Easy  |  Medium  |  Hard                    │  ← Difficulty selector
├──────────────────────────────────────────────┤
│  [Sub-mode toggles, if applicable]           │  ← e.g., Picture/Word for Memory
├──────────────────────────────────────────────┤
│                                              │
│          GAME PLAY AREA                      │
│                                              │
├──────────────────────────────────────────────┤
│  ⭐⭐⭐  Score: 5  |  🔄 Restart              │  ← Status bar
└──────────────────────────────────────────────┘
```

## Visual Design

**Color palette (warm and inviting):**
- Background: `#FFF8EC` (cream)
- Primary accent: `#F4A261` (soft coral/peach)
- Secondary accent: `#E9C46A` (warm yellow)
- Success: `#A8C686` (sage green)
- Card backs / neutral tiles: `#F6CBA3` (peach)
- Text: `#5B3A29` (warm brown, not black)

**Typography:**
- Child-friendly rounded sans-serif (e.g., `"Comic Neue"`, `"Baloo 2"`, or system fallback like `"Nunito"`, `sans-serif`)
- Large sizes — minimum 20px body, 32px+ for game content, 48px+ for letters/words

**Animations:**
- Card flips: CSS 3D transform, ~0.4s
- Sparkle/star celebrations on correct answers
- Gentle shake (not harsh) on wrong answers
- Smooth transitions between games (fade)

**Sound (optional, with mute toggle):**
- Soft chime on correct
- Soft "boop" on incorrect (no sad/scary sounds)
- Celebration jingle on level complete
- All sounds generated at runtime using the Web Audio API (simple oscillator tones with short envelopes) — no audio files, keeps the HTML file small and self-contained

## Technical Architecture

**Single-file HTML structure:**
```
index.html
├── <style>  — all CSS (palette, layout, animations)
├── <body>
│   ├── header (game selector, difficulty, sub-toggles)
│   ├── main (game container — one div per game, only one visible at a time)
│   └── footer (score, restart)
└── <script>  — all JS (game logic modules)
```

**JS module structure (within the single `<script>` tag):**
- `state` — current game, difficulty, mode, score
- `ui` — render helpers, show/hide games, update status bar
- `games.memory` — match-the-pairs logic
- `games.pattern` — what-comes-next logic
- `games.puzzle` — missing-piece logic
- `games.logic` — odd-one-out logic
- `content` — data banks (word lists by length, emoji sets, pattern templates, puzzle pictures, odd-one-out groups)
- `audio` — inline sounds + mute state

**No external dependencies.** No frameworks, no CDN links, no fonts loaded over network (use system font stack with a nice rounded fallback).

**Content data** lives in JS objects, not files — e.g.:
```js
const WORDS = {
  easy: ['CAT', 'DOG', 'SUN', 'HAT', 'BUS'],
  medium: ['BALL', 'APPLE', 'HOUSE', 'TRAIN'],
  hard: ['FLOWER', 'ORANGE', 'RAINBOW', 'ELEPHANT']
};
```

## State Management

- Current game, difficulty, and sub-mode stored in a single `state` object in memory
- Score resets per game session (not persisted to localStorage in v1 — keep simple)
- No user accounts, no server, no tracking

## Error Handling

- None needed at boundaries (no network, no user input beyond clicks)
- Clicks on already-matched cards or invalid targets: ignore silently
- If content data is misconfigured (e.g., empty word list at a difficulty), show a fallback message and continue

## Testing

Since this is a small self-contained HTML file with no framework, testing is primarily manual:

- Open in Chrome, Firefox, Safari
- Play each of the 4 games at each of the 3 difficulties
- Verify Memory Picture↔Word mode at all 3 difficulties
- Verify Pattern sub-games (Shapes, Letters+Numbers, Words) at all 3 difficulties
- Confirm no console errors, no network requests, works fully offline
- Responsive check: desktop, tablet (game grid should remain playable on 768px+ wide)

A lightweight sanity-check approach: expose a `window.__runSelfTest()` function that cycles through each game's setup logic to confirm data banks aren't empty and core render functions don't throw.

## Out of Scope (v1)

- User accounts / progress saving
- Difficulty auto-adjustment based on performance
- Multiplayer or parent dashboard
- Printable certificates
- Localization (English only)
- Accessibility beyond basic (no full ARIA/screen-reader pass in v1)
- Mobile phone layout (tablet+ only for v1)

## Success Criteria

- A parent can open the HTML file and hand it to a 5-7 year old with no setup or explanation
- The child can navigate between all 4 games and 3 difficulties using the toggle bar
- Each game is visually distinct, uses warm colors, and feels rewarding
- The file works offline and is under 200 KB total (no external assets, sounds generated at runtime)
- No console errors, no broken interactions, works in Chrome/Firefox/Safari
