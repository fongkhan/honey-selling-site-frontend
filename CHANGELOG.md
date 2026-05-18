# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Initial Astro 4 SSG scaffold (`output: 'static'`).
- Tailwind CSS integration.
- `src/lib/payload.ts` — REST client for Payload CMS content (pages, posts).
- `src/lib/medusa.ts` — Store API client for Medusa products.
- `src/utils/lexicalRender.ts` — Lexical → HTML renderer for Payload rich text.
- `build_astro.sh` — o2switch rebuild script (alt-nodejs24, rsync to `WEB_ROOT`, lockfile).
- `webhook-payload.php` — HMAC-validated webhook receiver triggering the rebuild.
- `public/.htaccess` — HTTPS redirect, cache headers, security headers.
- `O2SWITCH_DEPLOYMENT.md` — step-by-step shared hosting deploy guide.
