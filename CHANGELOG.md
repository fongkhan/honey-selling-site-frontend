# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Dynamic layout blocks rendering engine inside `src/pages/index.astro` and `src/pages/histoire.astro` to map dynamic CMS blocks (`HeroBlock`, `ValuesBlock`, `StoryBlock`, `EngagementsBlock`, `QuoteBlock`, `FeaturedProductsBlock`, `LatestPostsBlock`) to exact frontend visual components.
- Lexical JSON dynamic parsing integration inside `src/pages/recettes-bienfaits/[slug].astro` using the `lexicalToHtml` utility to render Payload v3 editor outputs.
- Fully dynamic blog listing at `src/pages/recettes-bienfaits/index.astro` that pulls chronological post docs from the CMS and displays them seamlessly.
- Robust static fallback mechanisms across all pages (Home, Histoire, Blog, Post Details) to guarantee that if the CMS is offline, the site falls back to static content.
- Initial Astro 4 SSG scaffold (`output: 'static'`).
- Tailwind CSS integration.
- `src/lib/payload.ts` — REST client for Payload CMS content (pages, posts).
- `src/lib/medusa.ts` — Store API client for Medusa products.
- `src/utils/lexicalRender.ts` — Lexical → HTML renderer for Payload rich text.
- `build_astro.sh` — o2switch rebuild script (alt-nodejs24, rsync to `WEB_ROOT`, lockfile).
- `webhook-payload.php` — HMAC-validated webhook receiver triggering the rebuild.
- `public/.htaccess` — HTTPS redirect, cache headers, security headers.
- `O2SWITCH_DEPLOYMENT.md` — step-by-step shared hosting deploy guide.
- Premium typography (Fraunces serif & Plus Jakarta Sans) and elegant gold-amber organic animations (honey drip effects).
- Interactive Glassmorphism AJAX `CartDrawer.astro` component supporting real-time additions, removals, and dynamic quantity modifications.

### Fixed
- Medusa v2 cart items rendering crashes (`TypeError: item.variant is undefined` in `CartDrawer.astro`) by mapping direct properties (`item.variant_title`) instead of old nested structures.
- Structured CSS loading order in `src/styles/global.css` to prevent layout jumps.

