# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- **Système de Vente Directe Locale & Clamart (92140)** : Adaptation de l'éligibilité locale de Montrouge à Clamart (92140) et Paris (codes postaux commençant par `75`).
- **Blocage Géographique Strict (Étape 2)** : Ajout d'une validation stricte interdisant la commande aux clients hors secteurs éligibles (Paris / Clamart), avec affichage d'un panneau d'alerte rouge premium en verre poli.
- **Désactivation Totale des Paiements en Ligne** : Masquage complet du module Stripe Elements, suppression de l'injection du script externe Stripe SDK, et neutralisation des flux Google Pay/cartes de crédit pour privilégier le paiement physique à la livraison.
- **Réservation Directe (Étape 4)** : Soumission directe et finalisation immédiate du panier Medusa v2 (`POST /carts/:id/complete`) sous session manuelle système (`pp_system_default`) sans intermédiaire financier.
- **Option d'expédition unique (Étape 3)** : Forçage du mode "Retrait en main propre & Dépôt-vente" gratuit à 0,00 € pour tous les utilisateurs éligibles, en masquant complètement les modes de livraison postaux classiques.
- **Écran de Succès et Coordonnées Directes** : Affichage d'un écran de confirmation de réservation avec coordonnées de contact (téléphone/email) pour convenir d'un créneau de retrait physique.
- Rendu dynamique des photos de produits sur tout le site (page d'accueil, catalogue de la boutique, et fiches produits) avec fallback automatique sur la première image de la galerie de Medusa si le thumbnail n'est pas renseigné, évitant ainsi l'émoji de repli par défaut 🍯 lorsque des photos existent.
- Données Structurées JSON-LD intégrées à la volée dans le `<head>` de la mise en page générale (`Layout.astro`) de type `Store`, et sur les fiches produits (`boutique/[handle]` et `produits/[handle]`) de type `Product` pour une indexation sémantique (SEO) optimale.
- Cartes de produits de la page d'accueil cliquables : enveloppement du visuel pot de miel 🍯 et du titre `h3` dans des balises `<a>` pointant vers `/boutique/[handle]` (dans le bloc CMS et le repli HTML).
- Barre de navigation auto-adaptative (Dynamic Navbar) : récupération, filtrage (exclusion de `home`/`boutique`) et tri automatique (via `navbarOrder`) des pages du CMS dans `Layout.astro`, avec fallback raffiné.
- Routeur universel catch-all à la racine (`src/pages/[slug].astro`) pre-générant à la compilation (SSG) toutes les pages éditées dans Payload.
- Prise en charge des 8 types de blocs de mise en page CMS (`hero`, `pageHeader`, `values`, `story`, `engagements`, `quote`, `featuredProducts`, `latestPosts`) dans le rendu dynamique du routeur.

### Changed
- Remplacement du Stripe Payment Element par le panneau de réservation de paiement de la main à la main suite à la décision stratégique d'exclure les paiements en ligne.

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

