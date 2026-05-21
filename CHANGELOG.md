# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Rendu dynamique des photos de produits sur tout le site (page d'accueil, catalogue de la boutique, et fiches produits) avec fallback automatique sur la première image de la galerie de Medusa si le thumbnail n'est pas renseigné, évitant ainsi l'émoji de repli par défaut 🍯 lorsque des photos existent.
- Données Structurées JSON-LD intégrées à la volée dans le `<head>` de la mise en page générale (`Layout.astro`) de type `Store`, et sur les fiches produits (`boutique/[handle]` et `produits/[handle]`) de type `Product` pour une indexation sémantique (SEO) optimale.
- Cartes de produits de la page d'accueil cliquables : enveloppement du visuel pot de miel 🍯 et du titre `h3` dans des balises `<a>` pointant vers `/boutique/[handle]` (dans le bloc CMS et le repli HTML).
- Barre de navigation auto-adaptative (Dynamic Navbar) : récupération, filtrage (exclusion de `home`/`boutique`) et tri automatique (via `navbarOrder`) des pages du CMS dans `Layout.astro`, avec fallback raffiné.
- Routeur universel catch-all à la racine (`src/pages/[slug].astro`) pre-générant à la compilation (SSG) toutes les pages éditées dans Payload.
- Prise en charge des 8 types de blocs de mise en page CMS (`hero`, `pageHeader`, `values`, `story`, `engagements`, `quote`, `featuredProducts`, `latestPosts`) dans le rendu dynamique du routeur.
- Intégration du moderne **Stripe Payment Element (Option B)** au tunnel de checkout (`/commande`), offrant le support automatique de **Google Pay** et des cartes bancaires.
- Désactivation explicite d'Apple Pay (`wallets: { applePay: 'never' }`) pour respecter les contraintes budgétaires sans impacter le support de Google Pay.
- Mécanisme de double confirmation du paiement : inline sans rechargement pour les flux directs via `redirect: 'if_required'`, et parseur de retour de redirection (3D Secure) dans `init()` complétant le panier Medusa de manière résiliente.
- Personnalisation esthétique complète de l'élément de paiement Stripe (couleurs ambre et pierre HSL, typographie Outfit, angles adoucis) pour s'harmoniser avec la vitrine.

### Fixed
- JavaScript de la galerie d'images sur la fiche produit : correction du bug de closure en récupérant dynamiquement le nœud d'image principal dans le DOM à chaque clic, garantissant une mise à jour robuste et sans duplication.
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

