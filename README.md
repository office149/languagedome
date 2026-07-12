# Language Dome — Website

Marketing website for **Language Dome for Child Skills Development Training L.L.C.**
(Dubai DET License No. 1353863).

Single-file static site — no build step, no dependencies.

## Structure
```
index.html   # the entire site (HTML + CSS + JS inline)
```

## Local preview
Just open `index.html` in a browser, or run a tiny local server:
```bash
python3 -m http.server 8000
```
then visit http://localhost:8000

## Deployment
This repo is set up to deploy for free via **GitHub Pages** (see step-by-step guide).
It also works as-is on Vercel or Netlify with zero configuration, since it's static HTML.
