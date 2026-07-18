# Portfolio Redesign — Design Spec

**Date:** 2026-07-16
**Repo:** suhail017.github.io (GitHub Pages, auto-deploys from `main`)

## Goal

Rebuild Suhail Mahmud's personal site as a modern portfolio that works as a job-search asset. Positioning is broad — computational scientist spanning ML/DL, climate/atmospheric science, and risk modeling — with ML/DL work featured most prominently. Source of truth for content is the new CV (`Suhail_Mahmud_MLClimateScientist.pdf`) plus selected public GitHub repos.

## Decisions (from brainstorming)

- **Positioning:** broad (research + ML + engineering), ML/DL work leads.
- **Content:** industry work as case studies, publications section, downloadable CV, blog placeholder.
- **Style:** dark modern developer portfolio; teal accent (evolves current `#4c99af`).
- **Stack:** Jekyll, built natively by GitHub Pages (no Actions, no third-party theme).
- **Structure:** single scrolling homepage + separate blog pages.
- **History:** follow the new CV only (KatRisk → Tomorrow.io → KCC → Penn State → UTEP PhD). Old roles (instructor, Diganta TV, voluntary) dropped.
- **Photo:** keep `images/Suhail Mahmud hs.jpg`.

## Architecture

Custom Jekyll site. Content is data-driven so future edits don't touch HTML:

```
_config.yml                 # site metadata, permalink style
_layouts/default.html       # base layout (head, nav, footer)
_layouts/post.html          # blog post layout
_includes/*.html            # nav, footer, section partials
_data/experience.yml        # roles from the CV
_data/projects.yml          # featured work cards
_data/publications.yml      # journal + conference lists
_data/skills.yml            # skill groups from the CV
index.html                  # single-page home assembling sections
blog/index.html             # post listing
_posts/                     # one starter post
assets/css/main.css         # dark theme, no CDN dependencies
assets/js/main.js           # mobile nav + scroll-spy (vanilla)
assets/Suhail_Mahmud_ML_Climate_Scientist.pdf   # CV (moved from repo root)
research/index.html         # redirect stub -> /#projects
publication/index.html      # redirect stub -> /#publications
images/                     # photo kept
```

Removed: `about/`, `_layouts/page.html`, `css/main.css`, `Publications.md`, `images/_.html`, root CV PDF (moved), `images/CV_202203.pdf` (superseded). `README.md` refreshed to a short pointer at the live site.

Redirect stubs are plain HTML files with `<meta http-equiv="refresh">` + canonical link (no plugin dependency).

## Page structure (top to bottom)

1. **Hero** — photo, name, tagline "Computational Scientist — ML · Climate · Risk Modeling", 2-line summary from the CV, buttons: Download CV, GitHub, LinkedIn, Google Scholar, Email.
2. **Featured Work** (`#projects`) — card grid, ML/DL-forward, industry case studies first:
   - Wildfire/flood/surge ML damage models — KatRisk (proprietary badge)
   - Stochastic event catalogs for TC/winter storm — KCC (proprietary badge)
   - Real-time weather data pipelines on AWS/Snowflake — Tomorrow.io (proprietary badge)
   - Stochastic Weather Generator — PSU (GitHub link)
   - PBL-Height-Calculation-using-Hysplit (GitHub link)
   - ML emulation of atmospheric boundary layer / PhD work (links to Methods-for-determining-PBL-heights and wrf-code-for-Paso-del-Norte-Region repos)
   Each card: title, 2–3 sentence description, tech tags, link or badge.
3. **Experience** (`#experience`) — vertical timeline, CV roles only, with 2–3 highlight bullets each.
4. **Skills** (`#skills`) — grouped chips matching CV categories.
5. **Publications** (`#publications`) — full journal list from `Publications.md` (including 2021 papers missing from the old HTML page), DOI links where available, collapsible conference list (`<details>`), Scholar + ResearchGate links.
6. **Blog** (`#blog`) — latest-posts strip linking to `/blog/`; one starter post so it isn't empty.
7. **Contact/footer** — email, Natick MA, social links.

## Visual & technical

- Dark charcoal/navy background, single teal accent, system font stack, monospace accents for tags/labels.
- Card grid with subtle borders and hover states; sticky top nav with anchor links; fully responsive.
- No JS framework, no CDN dependencies; a few lines of vanilla JS for mobile nav toggle and scroll-spy.
- Accessible: semantic landmarks, alt text, sufficient contrast in the dark palette.

## Error handling / edge cases

- If GitHub Pages' Jekyll version lacks a feature, stick to core Liquid + data files (no custom plugins — only `github-pages`-whitelisted behavior; redirects are plain HTML, not a plugin).
- Old inbound URLs `/research` and `/publication` keep working via redirect stubs.
- Blog with a single post must not look broken — the strip renders whatever exists.

## Testing

- Commit a minimal `Gemfile` with the `github-pages` gem for local development (`bundle exec jekyll serve`); GitHub Pages ignores it and uses its own build. Review the served site in a browser before pushing.
- Check: all anchors resolve, CV download works, redirect stubs land on the right sections, no external requests besides outbound profile links, responsive layout at phone width.
