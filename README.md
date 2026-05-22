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
    │   ├── boutique/        
    │   │   ├── index.astro  Catalogue géré via Payload CMS
    │   │   └── [handle].astro Fiche produit avec détails Medusa + bienfaits CMS
    │   ├── [slug].astro     Routeur universel pour pages dynamiques éditables
    │   ├── commande.astro   Formulaire de checkout en 4 étapes
    │   └── index.astro      Page d'accueil avec miels cliquables
    ├── lib/
    │   ├── payload.ts       Payload REST client (build-time fetch + Types)
    │   └── medusa.ts        Medusa Store API client (build-time fetch)
    └── utils/
        └── lexicalRender.ts conversion Lexical → HTML
```

## Fonctionnalités Avancées

1. **Checkout en 4 étapes (`/commande`)** :
   Un accordéon de commande fluide qui guide le client à travers les étapes de saisie de contact, d'adresse de livraison, de choix des modes de livraison et de règlement sécurisé via **Stripe Payment Element**. Ce module intègre le support de **Google Pay** et des cartes bancaires de manière fluide et sécurisée (avec exclusion d'Apple Pay), prenant en charge les paiements directs inline (via `redirect: 'if_required'`) et les redirections sécurisées (comme 3D Secure) de manière résiliente.
   
   - **Retrait en main propre & Paiement physique** : Pour les clients éligibles (alentours de **Montrouge** et **Paris**), le système propose automatiquement à l'étape 3 le retrait gratuit en main propre ("Retrait en main propre & Dépôt-vente"). Si sélectionné, l'étape 4 masque Stripe pour afficher un panneau de consignes de réservation avec paiement en physique, bypassant le module Stripe lors du clic sur "Réserver et Finaliser" pour compléter la commande directement via la session manuelle par défaut de Medusa (`pp_system_default`). L'écran de succès s'adapte alors pour afficher les coordonnées de contact direct (téléphone et email) de la miellerie au lieu du suivi postal standard.

2. **Navbar Auto-Adaptative** :
   La barre de navigation se synchronise automatiquement avec les pages créées et configurées dans Payload CMS. Elle filtre la page d'accueil et la boutique pour n'afficher que vos pages institutionnelles (comme "Notre Histoire") triées selon l'ordre défini.

3. **Routeur Universel (`[slug].astro`)** :
   Il pré-génère statiquement à la compilation toutes les pages créées dans le CMS en convertissant les 8 structures de blocs visuels complexes (Héros, Témoignages, Engagements, Articles récents...) pour une performance SEO optimale.

4. **Rendu d'Images Produits Dynamique & Intelligent** :
   Les images s'adaptent de manière réactive sur l'ensemble du site. Si le champ de miniature principal du produit dans Medusa n'est pas renseigné, le site bascule intelligemment sur la première image de sa galerie pour éviter d'afficher un émoji de repli par défaut 🍯. Les fiches produits intègrent également une galerie interactive avec changement d'image instantané côté client.
