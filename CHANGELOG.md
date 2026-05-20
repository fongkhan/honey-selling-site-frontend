# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Cartes de produits de la page d'accueil cliquables : enveloppement du visuel pot de miel 🍯 et du titre `h3` dans des balises `<a>` pointant vers `/boutique/[handle]` (dans le bloc CMS et le repli HTML).
- Barre de navigation auto-adaptative (Dynamic Navbar) : récupération, filtrage (exclusion de `home`/`boutique`) et tri automatique (via `navbarOrder`) des pages du CMS dans `Layout.astro`, avec fallback raffiné.
- Routeur universel catch-all à la racine (`src/pages/[slug].astro`) pre-générant à la compilation (SSG) toutes les pages éditées dans Payload.
- Prise en charge des 8 types de blocs de mise en page CMS (`hero`, `pageHeader`, `values`, `story`, `engagements`, `quote`, `featuredProducts`, `latestPosts`) dans le rendu dynamique du routeur.
- Formulaire interactif de commande (Checkout) complet en 4 étapes (`/commande`) câblé en temps réel avec Medusa v2 (contact, adresse, livraison, paiement par défaut `pp_system_default`).

### Fixed
- Crash de la compilation statique Astro en downgradant `@astrojs/sitemap` de `3.7.2` à `3.6.0` (la version 3.7+ requérant Astro 5).
- Multiplication erronée des prix des miels : suppression de la division par 100 sur l'affichage des produits, variantes, panier, commande et accueil pour uniformiser avec les unités majeures de Medusa.
- Optimisation esthétique des boutons d'étapes du checkout (interdiction du retour à la ligne du texte, taille fixe des chevrons SVG).
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

