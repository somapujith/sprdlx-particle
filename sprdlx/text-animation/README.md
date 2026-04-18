# WonJYou Scroll Animation — Codegrid

A scroll-driven animation page using GSAP ScrollTrigger + Lenis smooth scroll.

## Setup

### 1. Add your images
Replace these placeholder files with your own:
- `hero.jpg` — portrait-style photo (5:7 ratio recommended)
- `outro.jpg` — portrait-style photo (5:7 ratio recommended)
- `whatido.svg` — your services label SVG (the outline text strip)

### 2. Run with a local server
This project uses ES modules (`type="module"`), so it **must** be served over HTTP — not opened as a file.

**Option A — VS Code Live Server**
Right-click `index.html` → "Open with Live Server"

**Option B — Node http-server**
```bash
npx http-server .
```

**Option C — Python**
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`

## How it works

| Animation | Trigger | Behaviour |
|---|---|---|
| Text reveal | `.animate-text` enters viewport | White layer clips in from top via `--clip-value` CSS var |
| Services slide-in | `.services` enters from bottom | Rows 1 & 3 slide from right, row 2 from left |
| Services pin + split | `.services` at top of viewport | Section pins for 2× screen height; rows 0 & 2 fly apart vertically |
| Services scale-down | Second half of pin | All rows scale down to ~10% (desktop) or 30% (mobile) |

## Dependencies (loaded via CDN)
- [GSAP 3](https://gsap.com/) + ScrollTrigger
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll

No npm install needed.
