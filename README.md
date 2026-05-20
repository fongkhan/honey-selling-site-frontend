# honey-selling-site-frontend

Site public d'une miellerie — Astro en SSG. Pull le contenu depuis Payload CMS
([honey-selling-site-cms](../cms)) et les produits depuis Medusa
([honey-selling-site-commerce](../commerce)) au moment du build.

## Stack

- Astro 4 (`output: 'static'`)
- Tailwind CSS
- Déployé en SSG sur o2switch
- Build déclenché par webhook (signé HMAC) depuis Payload ou Medusa

## Design & Charte Graphique Premium

Ce site a été conçu avec une esthétique visuelle haut de gamme et chaleureuse, rappelant l'univers de l'apiculture bio et artisanale :
- **Typographies de caractère** : Alliance de *Fraunces* (sérif élégante et organique pour les titres) et *Plus Jakarta Sans* (sans-sérif épurée et moderne pour le corps de texte).
- **Thème chromatique ambré** : Palette HSL personnalisée (tons or, miel, caramel et fond blanc cassé/sombre très doux).
- **Animations fluides** : Effets de micro-interactions interactives et animations organiques symbolisant des gouttes de miel ("drip effects").
- **Tiroir de Panier (Glassmorphism)** : Un composant interactif `CartDrawer.astro` en verre poli avec flou de fond (backdrop-filter) gère le panier en temps réel via AJAX, communiquant de façon transparente avec les endpoints MedusaJS v2 locaux ou distants.

## Dev

```bash
# Copier et configurer le fichier d'environnement
cp .env.example .env

# Installer les dépendances localement
npm install

# Démarrer le serveur de développement Astro
npm run dev        # http://localhost:4321
```

## Build & déploiement (manuel)

```bash
npm run build      # compile le site statique et génère le dossier → dist/

# Script d'orchestration automatique (sur o2switch) :
bash build_astro.sh
```

## Webhook → rebuild

1. `webhook-payload.php` reçoit le POST (Payload ou Medusa).
2. Il valide la signature HMAC-SHA-256 contre `BUILD_WEBHOOK_SECRET`.
3. Il lance `build_astro.sh` en arrière-plan et répond `202`.
4. Le script `pull → install → build → rsync` vers `WEB_ROOT`.

Voir [O2SWITCH_DEPLOYMENT.md](./O2SWITCH_DEPLOYMENT.md) pour les chemins
exacts à adapter sur l'hébergement.

## Variables d'environnement

Voir `.env.example`. Le secret `BUILD_WEBHOOK_SECRET` doit être **identique**
dans les trois repos (frontend, cms, commerce).

## Structure

```
frontend/
├── build_astro.sh           script de rebuild (sur le serveur)
├── webhook-payload.php      receveur webhook (public_html)
├── astro.config.mjs
├── tailwind.config.mjs
├── public/
│   └── .htaccess            preserved across deploys
└── src/
    ├── pages/               Astro routes (SSG)
    ├── lib/
    │   ├── payload.ts       Payload REST client (build-time fetch)
    │   └── medusa.ts        Medusa Store API client (build-time fetch)
    └── utils/
        └── lexicalRender.ts conversion Lexical → HTML
```
