# Programming by Chat — ASE 2026 Talk

Slides for *Programming by Chat: A Large-Scale Behavioral Analysis of 11,579 Real-World AI-Assisted IDE Sessions* (ASE 2026, Munich). 12-minute talk + 3-minute Q&A.

Plain HTML/CSS/JS, no build step.

## Run

Open `index.html` in a browser. Everything works offline except the embedded cluster explorer (slide 14), which falls back to the static t-SNE figure.

| Key | Action |
|---|---|
| ↓ → Space PgDn | Next slide |
| ↑ ← PgUp | Previous slide |
| Home / End | First / last slide |
| O | Toggle outline rail |
| F | Fullscreen |

Append `#n` to the URL to open slide *n*. Print from the browser to export a PDF (one slide per page).

## Structure

```
index.html          all slides (one <section class="slide"> each)
css/slides.css      tokens (ND palette), rail, stage, shared components
css/content.css     per-slide layout
js/slides.js        scaling, paging, outline rail, reveal animation
figures/logos/      institution, venue, and tool logos
figures/paper/      paper figures (PDF → SVG via pdftocairo -svg)
vendor/fontawesome/ Font Awesome 6.7.2 (local, for offline use)
```

Slides are authored on a fixed 1600 × 900 canvas and scaled to fit the window. The outline rail is built from each slide's `data-title` and `data-group`.
