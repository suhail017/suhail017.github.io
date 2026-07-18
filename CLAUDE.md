# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Suhail Mahmud's portfolio site, served by GitHub Pages at suhail017.github.io. Pushing to `main` deploys — there is no CI. It is a custom Jekyll site (no third-party theme, no plugins beyond the `github-pages` gem defaults, no CDN dependencies).

## Commands

- `bundle install` — one-time setup (needs Ruby ≥ 3.2; Homebrew `ruby@3.3` works).
- `bundle exec jekyll serve` — build and serve at http://127.0.0.1:4000 with live rebuild.
- `bundle exec jekyll build` — build into `_site/` (the closest thing to a test; run before pushing).

## Architecture

Content is data-driven — most edits should touch YAML, not HTML:

- `_data/experience.yml`, `_data/projects.yml`, `_data/publications.yml`, `_data/skills.yml` — all portfolio content. The homepage sections loop over these.
- `index.html` — single-page homepage (hero → featured work → experience → skills → publications → writing). Contact info lives in `_includes/footer.html`.
- `_layouts/default.html` + `_includes/nav.html`/`footer.html` — shared shell; `_layouts/post.html` — blog posts.
- `_posts/` + `blog/index.html` — standard Jekyll blog.
- `assets/css/main.css` — the entire theme (dark, teal accent, CSS variables in `:root`); `assets/js/main.js` — mobile nav + scroll-spy, vanilla JS.
- `assets/Suhail_Mahmud_ML_Climate_Scientist.pdf` — the CV the hero button serves; replace this file to update the CV.
- `research/index.html` and `publication/index.html` — plain-HTML redirect stubs to homepage anchors (old inbound URLs); keep them.

The design spec and implementation plan are in `docs/superpowers/`.
