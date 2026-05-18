# Déploiement sur o2switch

Procédure pour le frontend Astro sur l'hébergement mutualisé o2switch
(CloudLinux + Apache + alt-nodejs + cPanel).

## Prérequis

- Un compte o2switch avec accès SSH (généralement activé sur demande).
- Node.js 24 disponible via cPanel → **Setup Node.js App** (ou en CLI :
  `/opt/alt/alt-nodejs24/root/usr/bin/`).
- Un sous-domaine pointé vers le dossier public (ex. `www.miellerie.fr`).

## Étapes

### 1. Cloner le repo

```bash
ssh USER@USER.o2switch.net
cd ~/repositories                       # crée si nécessaire
git clone git@github.com:USER/honey-selling-site-frontend.git
cd honey-selling-site-frontend
cp .env.example .env
# éditer .env avec les URLs Payload + Medusa et le secret webhook
```

### 2. Régler les chemins dans `build_astro.sh`

Remplace `USER` par ton login o2switch dans :

```bash
REPO_DIR=/home/USER/repositories/honey-selling-site-frontend
WEB_ROOT=/home/USER/www                  # dossier servi par Apache (ex: public_html)
NODE_PATH=/opt/alt/alt-nodejs24/root/usr/bin
```

Puis :

```bash
chmod +x build_astro.sh
bash build_astro.sh                      # premier build manuel
```

### 3. Installer le secret du webhook hors du web root

```bash
mkdir -p ~/private && chmod 700 ~/private
cat > ~/private/honey-webhook.env.php <<'PHP'
<?php
$BUILD_WEBHOOK_SECRET = 'colle-ici-une-chaine-aleatoire-de-32-caracteres';
PHP
chmod 600 ~/private/honey-webhook.env.php
```

### 4. Déposer le webhook PHP

```bash
cp webhook-payload.php ~/www/__hooks/rebuild.php
```

Configurer Payload et Medusa pour POSTer vers :

```
https://www.miellerie.fr/__hooks/rebuild.php
```

avec le header `X-Hub-Signature-256: sha256=<hmac>` (le code des hooks le
fait déjà — voir `cms/src/hooks/triggerBuild.ts` et
`commerce/src/subscribers/trigger-build.ts`).

### 5. Préparer les logs

```bash
mkdir -p ~/logs
touch ~/logs/honey-webhook.log
```

### 6. Tester

```bash
# Depuis ta machine, simule un webhook signé :
BODY='{"source":"test"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "ton-secret" | awk '{print $2}')
curl -X POST https://www.miellerie.fr/__hooks/rebuild.php \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIG" \
  -d "$BODY"
# → {"ok":true,"queued":true}
tail -f ~/logs/honey-webhook.log         # voir le build démarrer
```

## Pièges connus

- **`.htaccess` écrasé** : `build_astro.sh` exclut explicitement
  `.htaccess` du `rsync --delete`. Conserve-le dans `public/` du repo pour
  qu'il soit aussi déployé lors d'un premier build.
- **Path Node introuvable** : si `/opt/alt/alt-nodejs24/` n'existe pas,
  vérifier la version disponible avec `ls /opt/alt/`.
- **Permissions du script** : `chmod +x build_astro.sh` est obligatoire,
  sinon le `popen()` PHP échouera silencieusement.
- **`popen` désactivé** : certains hébergeurs PHP bloquent `popen`. Si
  `~/logs/honey-webhook.log` ne montre jamais "build queued", vérifier
  `disable_functions` dans `php.ini` (cPanel → MultiPHP INI Editor).
