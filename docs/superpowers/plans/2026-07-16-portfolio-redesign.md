# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild suhail017.github.io as a dark-themed, single-page Jekyll portfolio driven by YAML data files, with a blog, publications, downloadable CV, and redirects from old URLs.

**Architecture:** Custom Jekyll site built natively by GitHub Pages (no Actions, no third-party theme). All content lives in `_data/*.yml`; `index.html` assembles sections with Liquid; blog uses standard `_posts/`. Old `/research` and `/publication` URLs become plain-HTML redirect stubs.

**Tech Stack:** Jekyll (via `github-pages` gem locally), Liquid, vanilla CSS/JS. No CDN dependencies, no custom plugins.

## Global Constraints

- GitHub Pages native build only: no plugins beyond the `github-pages` whitelist; redirects are plain HTML files, not a plugin.
- No external requests from the site itself (no CDN CSS/JS/fonts); outbound profile links only.
- Dark palette with a single teal accent; system font stack with monospace accents.
- Content follows the new CV only (KatRisk → Tomorrow.io → KCC → Penn State → UTEP PhD); no pre-2014 roles or voluntary positions.
- Spec: `docs/superpowers/specs/2026-07-16-portfolio-redesign-design.md`.
- Verification for every task is `bundle exec jekyll build` succeeding (this repo has no test framework); the final task adds served-site curl checks.
- Working directory for all commands: repo root (`/Users/suhail/suhail017.github.io`).

---

### Task 1: Jekyll scaffolding (Gemfile, _config.yml, stale-file cleanup)

**Files:**
- Create: `Gemfile`
- Modify: `_config.yml` (full rewrite)
- Delete: `_layouts/page.html`, `images/_.html`
- Move: `Suhail_Mahmud_MLClimateScientist.pdf` → `assets/Suhail_Mahmud_ML_Climate_Scientist.pdf`

**Interfaces:**
- Consumes: nothing.
- Produces: a repo where `bundle exec jekyll build` succeeds; CV served at `/assets/Suhail_Mahmud_ML_Climate_Scientist.pdf` (later tasks link to this exact path).

- [ ] **Step 1: Check tooling**

Run: `ruby --version && bundle --version`
Expected: any Ruby ≥ 2.7 and a Bundler version. If `bundle` is missing, run `gem install bundler --user-install`. If the system Ruby is too old or native gems fail to compile in Step 4, run `brew install ruby`, prepend it to PATH (`export PATH="$(brew --prefix ruby)/bin:$PATH"`), and retry.

- [ ] **Step 2: Write `Gemfile`**

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
```

- [ ] **Step 3: Rewrite `_config.yml`** (replaces the 3-line theme file; the custom layouts in later tasks make the theme unnecessary)

```yaml
title: Suhail Mahmud
tagline: Computational Scientist — ML · Climate · Risk Modeling
description: >-
  Portfolio of Suhail Mahmud — machine learning, climate and atmospheric
  science, and catastrophe risk modeling.
url: "https://suhail017.github.io"
timezone: America/New_York

markdown: kramdown
permalink: /blog/:year/:month/:day/:title/

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - CLAUDE.md
  - docs/
  - vendor/
```

- [ ] **Step 4: Install gems and delete stale files**

```bash
bundle install
git rm _layouts/page.html images/_.html
mkdir -p assets
git mv Suhail_Mahmud_MLClimateScientist.pdf assets/Suhail_Mahmud_ML_Climate_Scientist.pdf
```
Expected: `bundle install` ends with "Bundle complete!". (`Suhail_Mahmud_MLClimateScientist.pdf` is untracked, so if `git mv` fails run `mv Suhail_Mahmud_MLClimateScientist.pdf assets/Suhail_Mahmud_ML_Climate_Scientist.pdf && git add assets/`.)

- [ ] **Step 5: Verify the build**

Run: `bundle exec jekyll build`
Expected: exits 0, "done in X seconds". The old `index.html` still builds — it has no front matter, so Jekyll copies it verbatim. `_site/assets/Suhail_Mahmud_ML_Climate_Scientist.pdf` exists.

- [ ] **Step 6: Commit**

```bash
git add Gemfile Gemfile.lock _config.yml assets/
git commit -m "chore: scaffold Jekyll build, move CV into assets"
```

---

### Task 2: Content data files

**Files:**
- Create: `_data/experience.yml`, `_data/projects.yml`, `_data/publications.yml`, `_data/skills.yml`

**Interfaces:**
- Consumes: nothing.
- Produces: the exact schemas the homepage Liquid loops over —
  `site.data.experience` (list of `{role, company, dates, highlights: [str]}`),
  `site.data.projects` (list of `{title, org, badge?, description, tags: [str], links?: [{label, url}]}`),
  `site.data.publications` (`{journal: [{text, url?}], conference: [{text}]}`),
  `site.data.skills` (list of `{group, items: [str]}`).

- [ ] **Step 1: Write `_data/experience.yml`** (content from the CV, condensed to 2–3 highlights per role)

```yaml
- role: Senior Data Scientist
  company: KatRisk LLC
  dates: Aug 2024 – Jan 2026
  highlights:
    - Built probabilistic hazard and vulnerability models for wildfire, flood,
      and storm surge perils, feeding stochastic event catalog workflows used
      by reinsurance clients.
    - Developed ML-based damage ratio estimation models combining geospatial
      exposure layers with historical loss data, improving loss curve accuracy.
    - Processed and quality-controlled large geospatial hazard datasets for
      downstream probabilistic modeling and cat model scoring.

- role: Data Engineer
  company: Tomorrow.io
  dates: Aug 2023 – Aug 2024
  highlights:
    - Engineered cloud-based pipelines on AWS to ingest high-resolution NWP
      forecasts and observational weather data for real-time risk analytics.
    - Built ETL workflows loading multi-source atmospheric and satellite
      datasets into Snowflake, supporting downstream ML feature pipelines.
    - Developed quality-control checks for global weather data streams,
      handling gaps, outliers, and format inconsistencies.

- role: Senior Research Scientist
  company: Karen Clark & Company
  dates: May 2022 – Aug 2023
  highlights:
    - Contributed statistical and physical modeling to stochastic event
      catalogs for tropical cyclone, winter storm, and severe convective storm
      perils.
    - Led historical loss analysis and vulnerability model validation,
      benchmarking against third-party cat models and industry datasets.
    - Applied regression and clustering methods to improve damage function
      estimation across diverse building stock and exposure portfolios.

- role: Postdoctoral Scholar
  company: Penn State University
  dates: Jan 2021 – Apr 2022
  highlights:
    - Researched atmospheric boundary layer dynamics with WRF large-eddy
      simulation — turbulence structure, surface flux parameterization, and
      validation against observations.
    - Built a stochastic weather generator for the Mid-Atlantic region focused
      on extreme climate events.

- role: Research Assistant (PhD)
  company: University of Texas at El Paso
  dates: Aug 2014 – Dec 2020
  highlights:
    - Developed ML surrogate models emulating WRF-simulated boundary layer
      processes, accelerating large-ensemble runs on XSEDE HPC systems.
    - Built ingestion pipelines for reanalysis and NWP outputs with quality
      control across vertical atmospheric profiles.
    - Authored peer-reviewed publications on ML-based atmospheric modeling;
      presented at SIAM and AMS national conferences.
```

- [ ] **Step 2: Write `_data/projects.yml`** (industry case studies first, then GitHub work)

```yaml
- title: ML Damage Models for Wildfire, Flood & Storm Surge
  org: KatRisk LLC
  badge: Proprietary
  description: >-
    Machine-learning damage ratio estimation combining geospatial exposure
    layers with historical loss data, alongside probabilistic hazard and
    vulnerability models feeding stochastic event catalogs used by
    reinsurance clients.
  tags: [Python, XGBoost, GeoPandas, rasterio, scikit-learn]

- title: Stochastic Event Catalogs for Atmospheric Perils
  org: Karen Clark & Company
  badge: Proprietary
  description: >-
    Statistical and physical modeling for tropical cyclone, winter storm, and
    severe convective storm event catalogs, with vulnerability validation
    benchmarked against third-party catastrophe models and industry loss data.
  tags: [Python, regression, clustering, catastrophe modeling]

- title: Real-Time Weather Data Pipelines
  org: Tomorrow.io
  badge: Proprietary
  description: >-
    AWS pipelines ingesting high-resolution NWP forecasts and global
    observations into Snowflake with automated quality control, powering
    real-time risk analytics and ML feature pipelines.
  tags: [AWS, Snowflake, ETL, Python, NWP]

- title: Stochastic Weather Generator for the Mid-Atlantic
  org: Penn State University
  description: >-
    A stochastic weather generator focused on extreme climate events in the
    Mid-Atlantic, built as part of the MARISA and ICoM coastal-resilience
    projects.
  tags: [Python, R, statistics, climate extremes]
  links:
    - label: GitHub
      url: https://github.com/suhail017/Stochastic-Weather-Generator

- title: PBL Height Calculation using HYSPLIT
  org: UTEP research
  description: >-
    Python tooling for computing planetary boundary layer heights from
    HYSPLIT, part of a broader ensemble approach to PBL determination
    validated against radiosonde, ceilometer, and satellite observations.
  tags: [Python, HYSPLIT, boundary layer, atmospheric science]
  links:
    - label: GitHub
      url: https://github.com/suhail017/PBL-Height-Calculation-using-Hysplit

- title: ML Emulation of the Atmospheric Boundary Layer
  org: PhD dissertation, UTEP
  description: >-
    Supervised-learning surrogates emulating WRF-simulated boundary layer
    processes to accelerate large-ensemble NWP runs on XSEDE HPC systems —
    the core of a dissertation on optimizing regional weather and air
    quality models.
  tags: [PyTorch, WRF, HPC, supervised learning]
  links:
    - label: PBL methods
      url: https://github.com/suhail017/Methods-for-determining-PBL-heights
    - label: WRF configs
      url: https://github.com/suhail017/wrf-code-for-Paso-del-Norte-Region
```

- [ ] **Step 3: Write `_data/publications.yml`** (from `Publications.md`; DOI links only where the DOI is known — do not invent DOIs for the rest)

```yaml
journal:
  - text: >-
      Bhuiyan, M.A.M., Sahi, R.K., Islam, M.R., and Mahmud, S. "Machine
      Learning Techniques Applied to Predict Tropospheric Ozone in a
      Semi-Arid Climate Region." Mathematics 9, no. 22 (2021): 2901.
    url: https://doi.org/10.3390/math9222901
  - text: >-
      Bhuiyan, M.A.M., Mahmud, S., Islam, M.R., and Tasnim, N. "Volatility
      estimation for COVID-19 daily rates using Kalman filtering technique."
      Results in Physics 26 (2021): 104291.
    url: https://doi.org/10.1016/j.rinp.2021.104291
  - text: >-
      Mahmud, S., Karle, N.N., Fitzgerald, R.M., Lu, D., Nalli, N.R., and
      Stockwell, W.R. "Intercomparison of Sonde, WRF/CAMx and Satellite
      Sounder Profile Data for the Paso Del Norte Region." Aerosol Science
      and Engineering 4, no. 4 (2020): 277–292.
  - text: >-
      Karle, N.N., Mahmud, S., Sakai, R.K., Fitzgerald, R.M., Morris, V.R.,
      and Stockwell, W.R. "Investigation of the Successive Ozone Episodes in
      the El Paso–Juarez Region in the Summer of 2017." Atmosphere 11, no. 5
      (2020): 532.
    url: https://doi.org/10.3390/atmos11050532
  - text: >-
      Bhuiyan, M.A.M., Mahmud, S., Sarmin, N., and Elahee, S. "A Study on
      Statistical Data Mining Algorithms for the Prediction of Ground-Level
      Ozone Concentration in the El Paso–Juarez Area." Aerosol Science and
      Engineering (2020): 1–13.
  - text: >-
      Mahmud, S., Bhuiyan, M.A.M., et al. "Study of Wind Speed and Relative
      Humidity using Stochastic Technique in a Semi-arid Climate Region."
      AIMS Environmental Science 7, no. 2 (2020): 156–173.
    url: https://doi.org/10.3934/environsci.2020010
  - text: >-
      Mahmud, S., Bhuiyan, M.A.M., et al. "Machine learning applied to study
      ground level PM2.5 across the Paso del Norte region." Air Quality,
      Atmosphere & Health.
  - text: >-
      Hussung, S., Mahmud, S., Sampath, A., Wu, M., Guo, P., and Wang, J.
      "Evaluation of data-driven causality discovery approaches among
      dominant climate modes." UMBC Faculty Collection (2019).
  - text: >-
      Mahmud, S., Wangchuk, P., Fitzgerald, R., Stockwell, W., and Lu, D.
      "Study of the Photolysis Rate Coefficients to improve Air Quality
      Models for the PdN region." American Physical Society, Volume 61.

conference:
  - text: >-
      Mahmud, S., Karle, N., Fitzgerald, R., and Stockwell, W.R. "Extensive
      Study of Planetary Boundary Layer Height in the Paso Del Norte Region
      Using CALIPSO Satellite, Ground Based Ceilometer, Radiosonde
      Measurement and Numerical Weather Prediction Models." AMS 100th Annual
      Meeting, 2020.
  - text: >-
      Hussung, S.R., Mahmud, S., Sampath, A., Wu, M., Guo, P., and Wang, J.
      "Evaluation of Data-Driven Causality Discovery Methods among Dominant
      Climate Modes." AMS 100th Annual Meeting, 2020.
  - text: >-
      Mahmud, S., Karle, N., Fitzgerald, R., and Stockwell, W.R. "Regional
      Weather Modeling for the Paso del Norte Region: A Sensitivity Study for
      Determining PBL." AMS 99th Annual Meeting, 2019.
  - text: >-
      Karle, N., Mahmud, S., Fitzgerald, R.M., Sakai, R.K., Stockwell, W.R.,
      Demoz, B.B., and Morris, V.R. "Analysis of Regional Meteorology During
      the Ozone Episodes in the El Paso–Juarez Airshed in the Summer of
      2017." AMS 99th Annual Meeting, 2019.
  - text: >-
      Mahmud, S., Karle, N., and Fitzgerald, R. "Inter-Comparison of WRF
      Simulations, Radiosonde Meteorological Observations and Satellite Data
      for the Paso del Norte Region." AMS 98th Annual Meeting, 2018.
  - text: >-
      DuBois, D.W., Morris, G.A., Spychala, M., Walter, P.J., Garcia, A.D.,
      Mahmud, S., Quevedo, A., et al. "The 2017 El Paso Ozone Transport Field
      Study." AMS 98th Annual Meeting, 2018.
  - text: >-
      Karle, N., Mahmud, S., and Fitzgerald, R. "Study of the Urban Heat
      Island and its Effect on the Planetary Boundary Layer for the El
      Paso-Juarez Airshed." AGU Fall Meeting, 2017.
  - text: >-
      Mahmud, S., Wangchuk, P., Fitzgerald, R., Stockwell, W., and Lu, D.
      "Study of the Photolysis Rate Coefficients to improve Air Quality
      Models." NOAA 8th Biennial Education and Science Forum, CUNY, 2016.
  - text: >-
      Mahmud, S., Lebrado, N., Fitzgerald, R., and Williams, S. "Correlation
      Between NDVI and LST using real time imagery for the Paso Del Norte
      Region." NOAA 8th Biennial Education and Science Forum, CUNY, 2016.
  - text: >-
      Mahmud, S., Wangchuk, P., Fitzgerald, R., Stockwell, W., and Lu, D.
      "Study of the Photolysis rate coefficients to improve air quality
      models of the El Paso–Juarez Airshed." Southwest Emerging Technology
      Symposium, UTEP, 2016.
  - text: >-
      Mahmud, S., Fitzgerald, R., and Williams, S. "Real time retrieval of
      Satellite Data for the Paso Del Norte Region." Graduate Expo, UTEP,
      2016.
  - text: >-
      Mahmud, S., Wangchuk, P., Fitzgerald, R., Stockwell, W., and Lu, D.
      "Study of the Photolysis Rate Coefficients for the Paso del Norte (PdN)
      Region." Graduate Expo, UTEP, 2015.
  - text: >-
      Mahmud, S., Galib, A., Fitzgerald, R., and Williams, S. "Use of
      Satellite Data to Perform Atmospheric Studies in the Paso del Norte
      Region." Graduate Expo, UTEP, 2015.
```

- [ ] **Step 4: Write `_data/skills.yml`**

```yaml
- group: Programming
  items:
    - Python (PyTorch, scikit-learn, NumPy, pandas)
    - R
    - Fortran (WRF)
    - SQL
    - Bash

- group: Climate & Geospatial Data
  items:
    - xarray
    - NetCDF / GRIB / HDF
    - Reanalysis (ERA5, NCEP)
    - NWP & WRF output
    - Satellite data

- group: Geospatial Tools
  items:
    - QGIS
    - GeoPandas
    - Shapely
    - rasterio
    - Cartopy

- group: ML Methods
  items:
    - Spatio-temporal ML
    - CNNs & RNNs
    - XGBoost & random forests
    - Regression (Ridge, Lasso, GLM)
    - Hurdle & ensemble models

- group: HPC & Infrastructure
  items:
    - SLURM / XSEDE
    - MPI parallelism
    - Large-ensemble simulation
    - AWS (S3, EC2)
    - Git

- group: Data Engineering & Visualization
  items:
    - ETL pipeline design
    - Snowflake
    - Databricks / dbt
    - PostgreSQL
    - matplotlib / plotly
    - Tableau / Power BI
```

- [ ] **Step 5: Verify the build**

Run: `bundle exec jekyll build`
Expected: exits 0. (Data files aren't rendered yet; this catches YAML syntax errors.)
Also run: `ruby -ryaml -e 'Dir["_data/*.yml"].each { |f| YAML.safe_load_file(f) }; puts "YAML OK"'`
Expected: `YAML OK`

- [ ] **Step 6: Commit**

```bash
git add _data/
git commit -m "feat: add experience, projects, publications, skills data"
```

---

### Task 3: Base layout, nav, footer, CSS, JS

**Files:**
- Create: `_layouts/default.html`, `_includes/nav.html`, `_includes/footer.html`, `assets/css/main.css`, `assets/js/main.js`
- Delete: `css/main.css` (old stylesheet, replaced)

**Interfaces:**
- Consumes: `site.title`, `site.tagline`, `site.description` from `_config.yml` (Task 1).
- Produces: layout name `default` (used via front matter by Task 4's `index.html`, Task 5's blog pages); CSS classes used by later tasks: `container`, `section`, `section-title`, `card-grid`, `card`, `badge`, `tags`, `tag`, `btn`, `btn-primary`, `timeline`, `timeline-item`, `chip-group`, `chips`, `chip`, `pub-list`, `post-list`, `hero`, `hero-photo`, `hero-links`.

- [ ] **Step 1: Write `_layouts/default.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if page.title %}{{ page.title }} · {{ site.title }}{% else %}{{ site.title }} — {{ site.tagline }}{% endif %}</title>
  <meta name="description" content="{{ page.excerpt | default: site.description | strip_html | strip_newlines | truncate: 160 }}">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  {% include nav.html %}
  <main>
    {{ content }}
  </main>
  {% include footer.html %}
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `_includes/nav.html`**

```html
<header class="site-nav">
  <div class="container nav-inner">
    <a class="brand" href="/">suhail<span>.mahmud</span></a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
    <nav>
      <ul class="nav-links" id="nav-links">
        <li><a href="/#projects">Work</a></li>
        <li><a href="/#experience">Experience</a></li>
        <li><a href="/#skills">Skills</a></li>
        <li><a href="/#publications">Publications</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Write `_includes/footer.html`**

```html
<footer class="site-footer" id="contact">
  <div class="container">
    <h2 class="section-title">Get in touch</h2>
    <p>
      <a class="btn btn-primary" href="mailto:suhail017@gmail.com">suhail017@gmail.com</a>
    </p>
    <p class="footer-links">
      <a href="https://github.com/suhail017">GitHub</a> ·
      <a href="https://www.linkedin.com/in/suhail-mahmud">LinkedIn</a> ·
      <a href="https://scholar.google.com/citations?user=S9X1k3IAAAAJ">Google Scholar</a> ·
      <a href="https://www.researchgate.net/profile/Suhail_Mahmud">ResearchGate</a>
    </p>
    <p class="footer-meta">Natick, MA · &copy; 2026 Suhail Mahmud</p>
  </div>
</footer>
```

- [ ] **Step 4: Write `assets/css/main.css`**

```css
:root {
  --bg: #0d1117;
  --bg-alt: #161b22;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #9aa4b2;
  --accent: #4fd1c5;
  --accent-dim: rgba(79, 209, 197, 0.12);
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: 4.5rem; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
img { max-width: 100%; }

.container { max-width: 1080px; margin: 0 auto; padding: 0 1.25rem; }

/* Nav */
.site-nav {
  position: sticky; top: 0; z-index: 10;
  background: rgba(13, 17, 23, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 3.5rem; flex-wrap: wrap;
}
.brand { font-family: var(--mono); font-weight: 700; color: var(--text); }
.brand span { color: var(--accent); }
.brand:hover { text-decoration: none; }
.nav-links { display: flex; gap: 1.25rem; list-style: none; margin: 0; padding: 0; }
.nav-links a { color: var(--muted); font-size: 0.95rem; }
.nav-links a:hover, .nav-links a.active { color: var(--accent); text-decoration: none; }
.nav-toggle {
  display: none; background: none; border: 1px solid var(--border);
  border-radius: 6px; color: var(--text); font-size: 1.1rem;
  padding: 0.25rem 0.6rem; cursor: pointer;
}

/* Hero */
.hero { padding: 4.5rem 0 3rem; }
.hero-inner { display: flex; gap: 2.5rem; align-items: center; flex-wrap: wrap; }
.hero-photo {
  width: 180px; height: 180px; border-radius: 50%; object-fit: cover;
  border: 3px solid var(--accent);
}
.hero h1 { font-size: 2.6rem; margin: 0 0 0.25rem; }
.hero .kicker {
  font-family: var(--mono); color: var(--accent);
  font-size: 0.95rem; margin: 0 0 0.75rem;
}
.hero .summary { color: var(--muted); max-width: 46rem; margin: 0 0 1.5rem; }
.hero-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }

/* Buttons */
.btn {
  display: inline-block; padding: 0.5rem 1.1rem; border-radius: 6px;
  border: 1px solid var(--border); color: var(--text); font-size: 0.95rem;
}
.btn:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }
.btn-primary { background: var(--accent); border-color: var(--accent); color: #0d1117; font-weight: 600; }
.btn-primary:hover { background: transparent; color: var(--accent); }

/* Sections */
.section { padding: 3rem 0; }
.section-title { font-size: 1.6rem; margin: 0 0 1.5rem; }
.section-title::after {
  content: ""; display: block; width: 3.5rem; height: 3px;
  background: var(--accent); margin-top: 0.5rem; border-radius: 2px;
}

/* Project cards */
.card-grid {
  display: grid; gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.card {
  background: var(--bg-alt); border: 1px solid var(--border);
  border-radius: 10px; padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.6rem;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.card:hover { border-color: var(--accent); transform: translateY(-2px); }
.card h3 { margin: 0; font-size: 1.1rem; }
.card .org { color: var(--muted); font-size: 0.85rem; font-family: var(--mono); }
.card p { margin: 0; color: var(--muted); font-size: 0.95rem; flex-grow: 1; }
.badge {
  align-self: flex-start; font-family: var(--mono); font-size: 0.72rem;
  padding: 0.1rem 0.55rem; border-radius: 999px;
  background: var(--accent-dim); color: var(--accent);
  border: 1px solid var(--accent);
}
.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0; padding: 0; list-style: none; }
.tag {
  font-family: var(--mono); font-size: 0.75rem; color: var(--muted);
  background: var(--bg); border: 1px solid var(--border);
  padding: 0.1rem 0.5rem; border-radius: 4px;
}
.card-links { display: flex; gap: 0.9rem; font-size: 0.9rem; }

/* Timeline */
.timeline { list-style: none; margin: 0; padding: 0; }
.timeline-item {
  position: relative; padding: 0 0 2rem 1.75rem;
  border-left: 2px solid var(--border);
}
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item::before {
  content: ""; position: absolute; left: -7px; top: 0.35rem;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--bg); border: 3px solid var(--accent);
}
.timeline-item h3 { margin: 0; font-size: 1.05rem; }
.timeline-item .meta { color: var(--muted); font-family: var(--mono); font-size: 0.85rem; }
.timeline-item ul { margin: 0.5rem 0 0; padding-left: 1.1rem; color: var(--muted); font-size: 0.95rem; }

/* Skills */
.chip-group { margin-bottom: 1.25rem; }
.chip-group h3 { margin: 0 0 0.5rem; font-size: 0.95rem; font-family: var(--mono); color: var(--accent); }
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
.chip {
  background: var(--bg-alt); border: 1px solid var(--border);
  border-radius: 999px; padding: 0.25rem 0.8rem; font-size: 0.88rem;
}

/* Publications */
.pub-list { margin: 0; padding-left: 1.25rem; }
.pub-list li { margin-bottom: 0.9rem; color: var(--muted); font-size: 0.95rem; }
.pub-list li::marker { color: var(--accent); }
details.pub-more summary {
  cursor: pointer; color: var(--accent); font-family: var(--mono);
  font-size: 0.9rem; margin: 1rem 0;
}
.pub-profiles { margin-top: 1.25rem; }

/* Blog */
.post-list { list-style: none; margin: 0; padding: 0; }
.post-list li {
  display: flex; gap: 1rem; align-items: baseline;
  padding: 0.6rem 0; border-bottom: 1px solid var(--border);
}
.post-list time { font-family: var(--mono); font-size: 0.85rem; color: var(--muted); white-space: nowrap; }
.post-body { max-width: 46rem; }
.post-body h1 { margin-top: 0; }
.post-meta { color: var(--muted); font-family: var(--mono); font-size: 0.85rem; }

/* Footer */
.site-footer {
  border-top: 1px solid var(--border); margin-top: 3rem;
  padding: 3rem 0; background: var(--bg-alt);
}
.footer-links a { color: var(--muted); }
.footer-links a:hover { color: var(--accent); }
.footer-meta { color: var(--muted); font-size: 0.85rem; }

/* Mobile */
@media (max-width: 720px) {
  .nav-toggle { display: block; }
  .site-nav nav { display: none; width: 100%; }
  .site-nav nav.open { display: block; }
  .nav-links { flex-direction: column; gap: 0; padding: 0.5rem 0 1rem; }
  .nav-links a { display: block; padding: 0.4rem 0; }
  .hero h1 { font-size: 2rem; }
  .hero-inner { gap: 1.5rem; }
}
```

- [ ] **Step 5: Write `assets/js/main.js`**

```js
// Mobile nav toggle
var toggle = document.querySelector('.nav-toggle');
var nav = document.querySelector('.site-nav nav');
if (toggle && nav) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });
}

// Scroll-spy: highlight the nav link for the section in view (homepage only)
var sections = document.querySelectorAll('main section[id]');
var links = document.querySelectorAll('.nav-links a[href^="/#"]');
if (sections.length && links.length && 'IntersectionObserver' in window) {
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(2)] = a; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = byId[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}
```

- [ ] **Step 6: Delete the old stylesheet and verify the build**

```bash
git rm -r css
bundle exec jekyll build
```
Expected: build exits 0; `_site/assets/css/main.css` and `_site/assets/js/main.js` exist. (The old `index.html` still references `css/main.css` — that's fine; Task 4 replaces it.)

- [ ] **Step 7: Commit**

```bash
git add _layouts/default.html _includes/ assets/css/ assets/js/
git commit -m "feat: add dark-theme layout, nav, footer, styles, and js"
```

---

### Task 4: Single-page homepage

**Files:**
- Modify: `index.html` (full rewrite)

**Interfaces:**
- Consumes: layout `default`; all four `_data` schemas from Task 2; CSS classes from Task 3; photo at `images/Suhail Mahmud hs.jpg`; CV at `/assets/Suhail_Mahmud_ML_Climate_Scientist.pdf`.
- Produces: section anchors `#projects`, `#experience`, `#skills`, `#publications`, `#blog`, `#contact` (contact lives in the footer include) — the redirect stubs in Task 6 target `#projects` and `#publications`.

- [ ] **Step 1: Rewrite `index.html`**

```html
---
layout: default
---
<section class="hero">
  <div class="container hero-inner">
    <img class="hero-photo" src="/images/Suhail%20Mahmud%20hs.jpg" alt="Suhail Mahmud">
    <div>
      <p class="kicker">ML · Climate · Risk Modeling</p>
      <h1>Suhail Mahmud</h1>
      <p class="summary">
        Computational scientist and ML practitioner with 10+ years at the
        intersection of atmospheric modeling, climate data, and machine
        learning — from WRF-based boundary layer research to production
        catastrophe models used by reinsurers.
      </p>
      <div class="hero-links">
        <a class="btn btn-primary" href="/assets/Suhail_Mahmud_ML_Climate_Scientist.pdf">Download CV</a>
        <a class="btn" href="https://github.com/suhail017">GitHub</a>
        <a class="btn" href="https://www.linkedin.com/in/suhail-mahmud">LinkedIn</a>
        <a class="btn" href="https://scholar.google.com/citations?user=S9X1k3IAAAAJ">Google Scholar</a>
        <a class="btn" href="mailto:suhail017@gmail.com">Email</a>
      </div>
    </div>
  </div>
</section>

<section class="section" id="projects">
  <div class="container">
    <h2 class="section-title">Featured Work</h2>
    <div class="card-grid">
      {% for project in site.data.projects %}
      <article class="card">
        <h3>{{ project.title }}</h3>
        <span class="org">{{ project.org }}</span>
        {% if project.badge %}<span class="badge">{{ project.badge }}</span>{% endif %}
        <p>{{ project.description }}</p>
        <ul class="tags">
          {% for tag in project.tags %}<li class="tag">{{ tag }}</li>{% endfor %}
        </ul>
        {% if project.links %}
        <div class="card-links">
          {% for link in project.links %}<a href="{{ link.url }}">{{ link.label }} &rarr;</a>{% endfor %}
        </div>
        {% endif %}
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section" id="experience">
  <div class="container">
    <h2 class="section-title">Experience</h2>
    <ul class="timeline">
      {% for job in site.data.experience %}
      <li class="timeline-item">
        <h3>{{ job.role }} · {{ job.company }}</h3>
        <span class="meta">{{ job.dates }}</span>
        <ul>
          {% for h in job.highlights %}<li>{{ h }}</li>{% endfor %}
        </ul>
      </li>
      {% endfor %}
    </ul>
  </div>
</section>

<section class="section" id="skills">
  <div class="container">
    <h2 class="section-title">Skills</h2>
    {% for group in site.data.skills %}
    <div class="chip-group">
      <h3>{{ group.group }}</h3>
      <ul class="chips">
        {% for item in group.items %}<li class="chip">{{ item }}</li>{% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>

<section class="section" id="publications">
  <div class="container">
    <h2 class="section-title">Publications</h2>
    <ol class="pub-list">
      {% for pub in site.data.publications.journal %}
      <li>{{ pub.text }}{% if pub.url %} <a href="{{ pub.url }}">[link]</a>{% endif %}</li>
      {% endfor %}
    </ol>
    <details class="pub-more">
      <summary>Conference presentations ({{ site.data.publications.conference | size }})</summary>
      <ul class="pub-list">
        {% for pub in site.data.publications.conference %}<li>{{ pub.text }}</li>{% endfor %}
      </ul>
    </details>
    <p class="pub-profiles">
      Full record on
      <a href="https://scholar.google.com/citations?user=S9X1k3IAAAAJ">Google Scholar</a> and
      <a href="https://www.researchgate.net/profile/Suhail_Mahmud">ResearchGate</a>.
    </p>
  </div>
</section>

<section class="section" id="blog">
  <div class="container">
    <h2 class="section-title">Writing</h2>
    <ul class="post-list">
      {% for post in site.posts limit: 3 %}
      <li>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %Y" }}</time>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
      {% endfor %}
    </ul>
    <p><a href="/blog/">All posts &rarr;</a></p>
  </div>
</section>
```

- [ ] **Step 2: Verify the build and rendered content**

```bash
bundle exec jekyll build
grep -c 'class="card"' _site/index.html
grep -c 'timeline-item' _site/index.html
grep -o 'id="projects"\|id="experience"\|id="skills"\|id="publications"\|id="blog"\|id="contact"' _site/index.html | sort -u
```
Expected: build exits 0; card count is 6; timeline-item count is 5; all six ids print. (The blog section renders an empty list until Task 5 — acceptable mid-plan state.)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rebuild homepage as single-page dark portfolio"
```

---

### Task 5: Blog (post layout, listing page, starter post)

**Files:**
- Create: `_layouts/post.html`, `blog/index.html`, `_posts/2026-07-16-rebuilding-my-portfolio.md`

**Interfaces:**
- Consumes: layout `default` (Task 3); CSS classes `post-list`, `post-body`, `post-meta`.
- Produces: `/blog/` listing page and at least one post so the homepage `#blog` strip is non-empty.

- [ ] **Step 1: Write `_layouts/post.html`**

```html
---
layout: default
---
<article class="section">
  <div class="container post-body">
    <h1>{{ page.title }}</h1>
    <p class="post-meta"><time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: "%B %-d, %Y" }}</time></p>
    {{ content }}
    <p><a href="/blog/">&larr; All posts</a></p>
  </div>
</article>
```

- [ ] **Step 2: Write `blog/index.html`**

```html
---
layout: default
title: Blog
---
<section class="section">
  <div class="container">
    <h1 class="section-title">Blog</h1>
    <ul class="post-list">
      {% for post in site.posts %}
      <li>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
      {% endfor %}
    </ul>
  </div>
</section>
```

- [ ] **Step 3: Write `_posts/2026-07-16-rebuilding-my-portfolio.md`**

```markdown
---
layout: post
title: "Rebuilding my portfolio"
---

I rebuilt this site from a set of hand-written HTML pages into a
data-driven Jekyll portfolio. Content — experience, projects,
publications, skills — now lives in YAML files, so updating the site
means editing data, not markup.

I plan to use this space for technical notes on machine learning for
weather and climate: boundary layer emulation, catastrophe model
validation, and the data engineering that holds it all together.
```

- [ ] **Step 4: Verify the build**

```bash
bundle exec jekyll build
ls _site/blog/2026/07/16/rebuilding-my-portfolio/index.html
grep -c 'rebuilding-my-portfolio' _site/blog/index.html _site/index.html
```
Expected: build exits 0; the post's output file exists; both the blog index and homepage reference the post (count ≥ 1 in each).

- [ ] **Step 5: Commit**

```bash
git add _layouts/post.html blog/ _posts/
git commit -m "feat: add blog with starter post"
```

---

### Task 6: Redirect stubs, legacy cleanup, README refresh

**Files:**
- Modify: `research/index.html`, `publication/index.html` (full rewrite as redirect stubs), `README.md` (full rewrite)
- Delete: `about/`, `Publications.md`, `images/CV_202203.pdf`

**Interfaces:**
- Consumes: homepage anchors `#projects` and `#publications` (Task 4).
- Produces: `/research/` and `/publication/` redirecting into the new site; a README pointing at the live site.

- [ ] **Step 1: Rewrite `research/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=/#projects">
  <link rel="canonical" href="https://suhail017.github.io/#projects">
  <title>Redirecting&hellip;</title>
</head>
<body>
  <p><a href="/#projects">This page has moved &rarr;</a></p>
</body>
</html>
```

- [ ] **Step 2: Rewrite `publication/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=/#publications">
  <link rel="canonical" href="https://suhail017.github.io/#publications">
  <title>Redirecting&hellip;</title>
</head>
<body>
  <p><a href="/#publications">This page has moved &rarr;</a></p>
</body>
</html>
```

- [ ] **Step 3: Delete legacy files**

```bash
git rm -r about Publications.md images/CV_202203.pdf
```
(Publication content now lives in `_data/publications.yml`; the current CV lives in `assets/`.)

- [ ] **Step 4: Rewrite `README.md`**

```markdown
# suhail017.github.io

Personal portfolio of **Suhail Mahmud** — machine learning, climate and
atmospheric science, and catastrophe risk modeling.

**Live site: [suhail017.github.io](https://suhail017.github.io)**

Built with Jekyll and served by GitHub Pages; pushing to `main` deploys.
Content lives in `_data/*.yml` (experience, projects, publications,
skills) — edit those files to update the site. Blog posts go in
`_posts/`. Run locally with `bundle exec jekyll serve`.
```

- [ ] **Step 5: Verify the build**

```bash
bundle exec jekyll build
grep refresh _site/research/index.html _site/publication/index.html
ls _site/about 2>&1
```
Expected: build exits 0; both grep lines show the meta refresh; `ls _site/about` errors with "No such file or directory".

- [ ] **Step 6: Commit**

```bash
git add research/index.html publication/index.html README.md
git commit -m "feat: redirect old pages, remove legacy content, refresh README"
```

---

### Task 7: Full served-site verification and CLAUDE.md update

**Files:**
- Modify: `CLAUDE.md` (full rewrite — the architecture it documents no longer exists)

**Interfaces:**
- Consumes: everything above.
- Produces: a verified site and accurate project docs. Nothing is pushed — pushing to `main` deploys the live site, so the final push is the user's call.

- [ ] **Step 1: Serve and check the site end-to-end**

```bash
bundle exec jekyll serve --port 4400 --detach
sleep 3
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4400/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4400/assets/Suhail_Mahmud_ML_Climate_Scientist.pdf
curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:4400/images/Suhail%20Mahmud%20hs.jpg"
curl -s http://127.0.0.1:4400/research/ | grep -c 'url=/#projects'
curl -s http://127.0.0.1:4400/publication/ | grep -c 'url=/#publications'
curl -s http://127.0.0.1:4400/blog/ | grep -c 'Rebuilding my portfolio'
curl -s http://127.0.0.1:4400/ | grep -c 'stackpath.bootstrapcdn.com'
pkill -f 'jekyll serve' || true
```
Expected: three `200` lines; the next three grep counts are `1`, `1`, `1`; the CDN grep count is `0` (grep exits 1 — confirms no external dependencies remain).

- [ ] **Step 2: Visual check**

Open `http://127.0.0.1:4400/` in a browser (re-serve if needed) or render a screenshot. Confirm: dark theme, hero photo circular, six project cards, timeline dots, chips wrap, publications collapsible works, layout holds at ~375px width.

- [ ] **Step 3: Rewrite `CLAUDE.md`**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Suhail Mahmud's portfolio site, served by GitHub Pages at suhail017.github.io. Pushing to `main` deploys — there is no CI. It is a custom Jekyll site (no third-party theme, no plugins beyond the `github-pages` gem defaults, no CDN dependencies).

## Commands

- `bundle install` — one-time setup (needs Ruby ≥ 2.7).
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
```

- [ ] **Step 4: Final build and commit**

```bash
bundle exec jekyll build
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for Jekyll architecture"
git log --oneline -8
```
Expected: build exits 0; log shows the commits from Tasks 1–7. Do **not** push — report to the user that pushing `main` publishes the site and let them decide.
