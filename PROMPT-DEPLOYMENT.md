# Prompt pour Gemini - Déploiement MOOWOOR Docs sur Cloudpepper avec Traefik

Bonjour Gemini,

Je dois déployer un site de documentation statique MOOWOOR sur mon serveur Cloudpepper qui utilise **Traefik** comme reverse proxy.

## ✅ Situation actuelle

**Les fichiers sont déjà copiés sur le serveur dans:**
```
~/moowoor-docs-demo/
```

**Contenu du répertoire:**
- `index-simple.html` - Page d'accueil du site
- `pages/` - Sous-pages (modules, métiers, gouvernance, parcours, dfu, observatoire)
- `img/` - Images et logo MOOWOOR
- `docker-compose.yml` - Configuration Docker avec labels Traefik (déjà configuré)
- `Caddyfile` - Configuration du serveur web Caddy
- `README-DEPLOYMENT.md` - Guide de déploiement

**Infrastructure serveur:**
- ✅ Serveur Cloudpepper avec Traefik déjà opérationnel
- ✅ Réseau Docker: `traefik-public` (existe déjà)
- ✅ Traefik entrypoints: `web` (port 80) et `websecure` (port 443)
- ✅ Domaine du serveur: `4wakixl01af.cloudpepper.site`

## 🎯 Objectif précis

Déployer le site pour qu'il soit accessible à l'URL:

**`https://4wakixl01af.cloudpepper.site/moowoor-doc`**

Avec:
- ✅ HTTPS automatique (géré par Traefik)
- ✅ Routing basé sur le chemin `/moowoor-doc`
- ✅ Middleware `stripprefix` pour enlever `/moowoor-doc` avant de passer à Caddy
- ✅ Redirection HTTP → HTTPS (gérée par Traefik global)

## 📋 Configuration déjà en place

Le fichier `docker-compose.yml` est **déjà configuré** avec:

```yaml
services:
  moowoor-docs:
    image: caddy:2-alpine
    container_name: moowoor-docs
    restart: unless-stopped
    volumes:
      - ./:/usr/share/caddy:ro
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      - traefik-public
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.moowoor-docs.rule=Host(`4wakixl01af.cloudpepper.site`) && PathPrefix(`/moowoor-doc`)"
      - "traefik.http.routers.moowoor-docs.entrypoints=websecure"
      - "traefik.http.routers.moowoor-docs.tls=true"
      - "traefik.http.services.moowoor-docs.loadbalancer.server.port=80"
      - "traefik.http.middlewares.moowoor-strip.stripprefix.prefixes=/moowoor-doc"
      - "traefik.http.routers.moowoor-docs.middlewares=moowoor-strip"
      - "traefik.http.routers.moowoor-docs-http.rule=Host(`4wakixl01af.cloudpepper.site`) && PathPrefix(`/moowoor-doc`)"
      - "traefik.http.routers.moowoor-docs-http.entrypoints=web"
      - "traefik.http.routers.moowoor-docs-http.middlewares=moowoor-strip"
```

## 🚀 Tâches à réaliser

**Étape 1: Vérifier l'environnement**
```bash
# Vérifier que nous sommes dans le bon répertoire
cd ~/moowoor-docs-demo
pwd

# Lister les fichiers pour confirmer
ls -la

# Vérifier que le réseau traefik-public existe
docker network ls | grep traefik-public
```

**Étape 2: Lancer le conteneur**
```bash
# Démarrer le service en arrière-plan
docker-compose up -d

# Vérifier que le conteneur démarre correctement
docker-compose ps
```

**Étape 3: Vérifier les logs**
```bash
# Suivre les logs en temps réel
docker-compose logs -f moowoor-docs

# Appuyer sur Ctrl+C pour arrêter le suivi
```

**Étape 4: Vérifier le déploiement**
```bash
# Vérifier que le conteneur tourne
docker ps | grep moowoor-docs

# Tester l'accès HTTP (devrait rediriger vers HTTPS)
curl -I http://4wakixl01af.cloudpepper.site/moowoor-doc

# Tester l'accès HTTPS
curl -I https://4wakixl01af.cloudpepper.site/moowoor-doc
```

**Étape 5: Vérifier dans le navigateur**
- Ouvrir: `https://4wakixl01af.cloudpepper.site/moowoor-doc`
- Vérifier que la page d'accueil s'affiche
- Tester la navigation vers les sous-pages (Modules, Métiers, etc.)
- Vérifier que les images se chargent correctement

## 🔍 Points de vérification

Après le déploiement, confirme que:

1. ✅ Le conteneur `moowoor-docs` est en état `Up`
2. ✅ L'URL `https://4wakixl01af.cloudpepper.site/moowoor-doc` affiche la page d'accueil
3. ✅ Les liens internes fonctionnent (ex: cliquer sur "Modules")
4. ✅ Les images s'affichent correctement
5. ✅ Le certificat HTTPS est valide
6. ✅ La redirection HTTP → HTTPS fonctionne

## 🐛 Dépannage si nécessaire

**Si le conteneur ne démarre pas:**
```bash
# Voir les logs d'erreur
docker-compose logs moowoor-docs

# Vérifier la syntaxe du Caddyfile
docker exec moowoor-docs caddy validate --config /etc/caddy/Caddyfile
```

**Si le site n'est pas accessible:**
```bash
# Vérifier les logs Traefik
docker logs traefik | grep moowoor

# Vérifier que les fichiers sont bien montés
docker exec moowoor-docs ls -la /usr/share/caddy
```

**Si erreur 404:**
- Vérifier que le middleware `stripprefix` est bien appliqué
- Vérifier les logs Caddy pour voir les requêtes reçues

## 📊 Commandes de maintenance

**Voir les logs:**
```bash
docker-compose logs -f moowoor-docs
```

**Redémarrer le service:**
```bash
docker-compose restart
```

**Arrêter le service:**
```bash
docker-compose down
```

**Voir l'état du conteneur:**
```bash
docker ps | grep moowoor-docs
docker stats moowoor-docs
```

## 🎯 Résultat attendu

Une fois le déploiement réussi, le site sera accessible à:

**🌐 https://4wakixl01af.cloudpepper.site/moowoor-doc**

Et affichera la page d'accueil MOOWOOR avec:
- Logo MOOWOOR
- Titre: "MOOWOOR - Santé Digitale Intelligente Zéro Papier"
- 6 cartes: Modules, Métiers, Gouvernance, Parcours, DFU, Observatoire
- Navigation fonctionnelle vers toutes les pages

## ⚙️ Architecture technique

```
Requête: https://4wakixl01af.cloudpepper.site/moowoor-doc
    ↓
Traefik (port 443)
    ↓
Middleware stripprefix (enlève /moowoor-doc)
    ↓
Caddy (reçoit la requête pour /)
    ↓
Fichier: /usr/share/caddy/index-simple.html
```

---

**Instructions pour toi, Gemini:**

1. Exécute les commandes de l'Étape 1 pour vérifier l'environnement
2. Exécute les commandes de l'Étape 2 pour lancer le conteneur
3. Exécute les commandes de l'Étape 3 pour vérifier les logs
4. Exécute les commandes de l'Étape 4 pour tester l'accès
5. Confirme-moi que tous les points de vérification sont OK
6. Si tu rencontres une erreur, utilise la section Dépannage

Merci de procéder étape par étape et de me tenir informé de chaque résultat.
