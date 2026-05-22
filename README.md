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
   Un accordéon de commande fluide qui guide le client à travers les étapes de contact, d'adresse, de livraison et de réservation :
   - **Alternative de contact flexible (Étape 1 & 2)** : Le champ e-mail de l'Étape 1 est facultatif. Si vous le laissez vide, le champ de téléphone de l'Étape 2 devient obligatoire avec un badge d'avertissement rouge dynamique. Medusa exigeant une adresse email, un e-mail technique de repli transparent est généré pour finaliser la commande sans jargon visible pour l'utilisateur.
   - **Bypass Géographique par Engagement (Étape 2)** : Saisissez une adresse. Si vous habitez en dehors de Paris ou Clamart (ex: Lyon), un panneau ambré en verre dépoli apparaît vous demandant de cocher un engagement de déplacement à Clamart ou dans l'un de nos dépôts-vente partenaires pour débloquer la suite. Si vous résidez à Paris ou Clamart, cet encart est automatiquement masqué.
   - **Adaptation Cohérente des Textes (Étape 4 & Succès)** : Le texte d'explication de l'Étape 4 et les consignes de l'Écran de Succès s'adaptent dynamiquement en temps réel. Ils félicitent et informent de manière personnalisée selon que le client habite localement ou s'est engagé à se déplacer de l'extérieur.
   - **Retrait en main propre & Dépôt-vente (Étape 3)** : Le système propose uniquement l'option gratuite "Retrait en main propre & Dépôt-vente" à 0,00 €, masquant les modes d'expédition postaux standards.
   - **Paiement 100% Physique (Étape 4)** : Aucun paiement en ligne ou empreinte de carte bancaire n'est requis ni proposé. Les scripts Stripe ont été entièrement désactivés et le tunnel affiche une carte de réservation transparente premium invitant l'acheteur à finaliser sa réservation de miel en main propre. Le panier Medusa v2 est finalisé directement via la session système manuelle (`pp_system_default`).
   - **Écran de Succès Adapté** : L'écran final confirme la réservation et affiche en évidence les instructions et coordonnées directes de la miellerie (téléphone, email) afin de planifier le rendez-vous ou le retrait dans l'un des dépôts-vente partenaires.

2. **Navbar Auto-Adaptative** :
   La barre de navigation se synchronise automatiquement avec les pages créées et configurées dans Payload CMS. Elle filtre la page d'accueil et la boutique pour n'afficher que vos pages institutionnelles (comme "Notre Histoire") triées selon l'ordre défini.

3. **Routeur Universel (`[slug].astro`)** :
   Il pré-génère statiquement à la compilation toutes les pages créées dans le CMS en convertissant les 8 structures de blocs visuels complexes (Héros, Témoignages, Engagements, Articles récents...) pour une performance SEO optimale.

4. **Rendu d'Images Produits Dynamique & Intelligent** :
   Les images s'adaptent de manière réactive sur l'ensemble du site. Si le champ de miniature principal du produit dans Medusa n'est pas renseigné, le site bascule intelligemment sur la première image de sa galerie pour éviter d'afficher un émoji de repli par défaut 🍯. Les fiches produits intègrent également une galerie interactive avec changement d'image instantané côté client.
