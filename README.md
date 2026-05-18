# honey-selling-site-frontend

Site public d'une miellerie — Astro en SSG. Pull le contenu depuis Payload CMS
([honey-selling-site-cms](../cms)) et les produits depuis Medusa
([honey-selling-site-commerce](../commerce)) au moment du build.

## Stack

- Astro 4 (`output: 'static'`)
- Tailwind CSS
- Déployé en SSG sur o2switch
- Build déclenché par webhook (signé HMAC) depuis Payload ou Medusa

## Dev

```bash
nvm use            # 24.15.0
cp .env.example .env
npm install
npm run dev        # http://localhost:4321
```

## Build & déploiement (manuel)

```bash
npm run build      # → dist/
# Sur o2switch :
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
