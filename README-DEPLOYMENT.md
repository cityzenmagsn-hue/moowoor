# Guide de Déploiement MOOWOOR Docs sur Cloudpepper

## 🌐 Configuration

**URL d'accès:** `https://4wakixl01af.cloudpepper.site/moowoor-doc`

**Domaine:** `4wakixl01af.cloudpepper.site`
**Chemin:** `/moowoor-doc`

## 🚀 Déploiement

### Étape 1: Se connecter au serveur

```bash
# Remplacez par vos credentials SSH
ssh user@4wakixl01af.cloudpepper.site
```

### Étape 2: Créer le répertoire de déploiement

```bash
# Sur le serveur
mkdir -p ~/moowoor-docs-demo
cd ~/moowoor-docs-demo
```

### Étape 3: Transférer les fichiers

**Option A - Depuis votre machine locale:**

```bash
# Sur votre machine locale
cd /home/grand-as/tools/odoo/extra_addons/moowoor/moowoor-docs-demo

# Transférer via SCP
scp -r * user@4wakixl01af.cloudpepper.site:~/moowoor-docs-demo/
```

**Option B - Via Git (si le repo est disponible):**

```bash
# Sur le serveur
git clone <url-du-repo> ~/moowoor-docs-demo
cd ~/moowoor-docs-demo
```

**Option C - Via rsync (recommandé):**

```bash
# Sur votre machine locale
rsync -avz --exclude='.git' \
  /home/grand-as/tools/odoo/extra_addons/moowoor/moowoor-docs-demo/ \
  user@4wakixl01af.cloudpepper.site:~/moowoor-docs-demo/
```

### Étape 4: Vérifier le réseau Traefik

```bash
# Sur le serveur
docker network ls | grep traefik-public

# Si le réseau n'existe pas, le créer
docker network create traefik-public
```

### Étape 5: Lancer le conteneur

```bash
# Sur le serveur
cd ~/moowoor-docs-demo
docker-compose up -d
```

### Étape 6: Vérifier le déploiement

```bash
# Voir les logs
docker-compose logs -f

# Vérifier que le conteneur tourne
docker ps | grep moowoor-docs

# Tester l'accès
curl -I https://4wakixl01af.cloudpepper.site/moowoor-doc
```

## 🔍 Vérification

Une fois déployé, accédez à:
- **HTTPS:** `https://4wakixl01af.cloudpepper.site/moowoor-doc`
- **HTTP:** `http://4wakixl01af.cloudpepper.site/moowoor-doc` (devrait rediriger vers HTTPS)

## 📊 Configuration Traefik

Le `docker-compose.yml` est configuré avec:

- **Route HTTPS:** `Host(4wakixl01af.cloudpepper.site) && PathPrefix(/moowoor-doc)`
- **Middleware:** `stripprefix` pour enlever `/moowoor-doc` avant de passer à Caddy
- **Port:** 80 (Caddy écoute en interne, Traefik gère le HTTPS)

## 🔧 Commandes utiles

### Voir les logs
```bash
docker-compose logs -f moowoor-docs
```

### Redémarrer le service
```bash
docker-compose restart
```

### Arrêter le service
```bash
docker-compose down
```

### Mettre à jour le site
```bash
# 1. Transférer les nouveaux fichiers (rsync ou scp)
rsync -avz /home/grand-as/tools/odoo/extra_addons/moowoor/moowoor-docs-demo/ \
  user@4wakixl01af.cloudpepper.site:~/moowoor-docs-demo/

# 2. Redémarrer le conteneur
docker-compose restart
```

### Voir l'état du conteneur
```bash
docker ps | grep moowoor-docs
docker stats moowoor-docs
```

## 🐛 Dépannage

### Le site n'est pas accessible

1. **Vérifier que le conteneur tourne:**
   ```bash
   docker ps | grep moowoor-docs
   ```

2. **Vérifier les logs du conteneur:**
   ```bash
   docker-compose logs moowoor-docs
   ```

3. **Vérifier les logs Traefik:**
   ```bash
   docker logs traefik
   ```

4. **Vérifier la route dans Traefik:**
   - Accédez au dashboard Traefik (si activé)
   - Cherchez le router `moowoor-docs`

### Erreur 404

Si vous obtenez une 404, vérifiez:
- Le middleware `stripprefix` est bien appliqué
- Le chemin dans la règle Traefik est correct
- Les fichiers sont bien montés dans le conteneur

```bash
# Vérifier les fichiers dans le conteneur
docker exec moowoor-docs ls -la /usr/share/caddy
```

### Le conteneur redémarre en boucle

```bash
# Voir les logs pour identifier l'erreur
docker-compose logs moowoor-docs

# Vérifier la syntaxe du Caddyfile
docker exec moowoor-docs caddy validate --config /etc/caddy/Caddyfile
```

## 📝 Architecture

```
Internet
    ↓
Traefik (HTTPS, Port 443)
    ↓
Middleware stripprefix (/moowoor-doc → /)
    ↓
Caddy Container (Port 80)
    ↓
Fichiers statiques (/usr/share/caddy)
```

## 🔐 Sécurité

- ✅ HTTPS géré par Traefik
- ✅ Fichiers montés en lecture seule (`:ro`)
- ✅ Headers de sécurité configurés dans Caddy
- ✅ Compression Gzip activée
- ✅ Cache des assets statiques

## 📈 Performance

- Cache navigateur: 1 an pour les assets statiques
- Compression Gzip activée
- Image Alpine (légère)
- Redémarrage automatique

## 🎯 Accès final

Une fois déployé, votre site sera accessible à:

**🌐 https://4wakixl01af.cloudpepper.site/moowoor-doc**

Tous les liens internes fonctionneront correctement grâce au middleware `stripprefix`.
