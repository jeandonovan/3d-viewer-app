# Production Deployment Guide - Self-Hosted

## Overview

Ce guide te permettra de déployer ton application 3D Viewer sur **ton propre serveur** avec contrôle total.

**Architecture** :
```
Your Domain
    ↓
Nginx (Reverse Proxy + SSL + Caching)
    ↓
Docker Container (Node.js + Next.js)
    ↓
Application
```

---

## 📋 Prérequis

### 1. Un Serveur (VPS)

**Options recommandées** :
- **Hetzner Cloud** : €3-5/mois (2GB RAM, 1 vCPU)
- **DigitalOcean** : $5/mois (1GB RAM, 1 vCPU)
- **Linode** : $5/mois (1GB RAM, 1 vCPU)
- **Scaleway** : €2-3/mois

**Spécifications minimales** :
- OS : Ubuntu 20.04 LTS ou 22.04 LTS
- RAM : 2 GB minimum
- Disque : 20 GB SSD
- CPU : 1 vCore minimum

### 2. Domaine (optionnel)

- Achète sur : Namecheap, GoDaddy, OVH, etc.
- Coût : ~$10/an

### 3. SSH Access

Clé SSH générée pour accès sécurisé au serveur.

---

## 🚀 Installation Pas à Pas

### Étape 1 : Se Connecter au Serveur

```bash
# Sur ton ordinateur local
ssh root@ton-serveur-ip

# Si tu as une clé SSH
ssh -i ~/chemin/vers/cle.pem root@ton-serveur-ip
```

### Étape 2 : Préparer le Serveur

```bash
# Update tout
apt-get update && apt-get upgrade -y

# Installe Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installe Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Vérifie les installations
docker --version
docker-compose --version
```

### Étape 3 : Utiliser le Script de Déploiement Automatisé

**Option A : Script automatisé (recommandé)**

```bash
# Sur le serveur, en tant que root
cd /root
wget https://raw.githubusercontent.com/jeandonovan/3D-viewer-app/main/deploy.sh
chmod +x deploy.sh
./deploy.sh main
```

**Cela va** :
- ✅ Installer toutes les dépendances
- ✅ Créer un utilisateur `deploy`
- ✅ Cloner ton repo GitHub
- ✅ Construire les images Docker
- ✅ Lancer les conteneurs
- ✅ Configurer Nginx
- ✅ Setup les logs

**Option B : Installation manuelle**

```bash
# 1. Créer utilisateur deploy
useradd -m -s /bin/bash deploy
usermod -aG docker deploy

# 2. Cloner le repo
su - deploy
cd ~
git clone https://github.com/jeandonovan/3D-viewer-app.git
cd 3D-viewer-app

# 3. Créer structure des logs
mkdir -p logs/nginx
chmod 755 logs

# 4. Builder et lancer
docker-compose build
docker-compose up -d

# 5. Vérifier
docker-compose ps
```

### Étape 4 : Tester l'Application

```bash
# Depuis ton serveur
curl http://localhost:3000

# Depuis ton ordinateur
curl http://ton-serveur-ip:3000

# Ouvre dans le navigateur
http://ton-serveur-ip:3000
```

---

## 🔐 Configuration HTTPS (SSL/TLS)

### Avec Let's Encrypt (Gratuit & Automatisé)

```bash
# Sur le serveur
apt-get install -y certbot python3-certbot-nginx

# Générer le certificat
certbot --nginx -d ton-domaine.com

# Renouvellement automatique
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Sans Let's Encrypt (certificat auto-signé)

```bash
# Générer une clé privée et un certificat (test seulement)
openssl req -x509 -newkey rsa:4096 -keyout /home/deploy/3d-viewer-app/ssl/key.pem \
  -out /home/deploy/3d-viewer-app/ssl/cert.pem -days 365 -nodes
```

### Activer HTTPS dans nginx.conf

```nginx
# Décommenter la section server HTTPS dans nginx.conf
server {
    listen 443 ssl http2;
    server_name ton-domaine.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ...
}

# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name ton-domaine.com;
    return 301 https://$host$request_uri;
}
```

```bash
# Recharger Nginx
docker-compose restart nginx
```

---

## 📊 Commandes Utiles pour Gérer l'App

### Voir le statut

```bash
cd /home/deploy/3d-viewer-app

# Lister les conteneurs
docker-compose ps

# Voir les logs en direct
docker-compose logs -f

# Logs spécifiques
docker-compose logs -f app
docker-compose logs -f nginx
```

### Redémarrer l'app

```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer juste l'app
docker-compose restart app

# Redémarrer juste Nginx
docker-compose restart nginx
```

### Arrêter/Démarrer

```bash
# Arrêter
docker-compose down

# Démarrer
docker-compose up -d

# Reconstruire et démarrer
docker-compose up -d --build
```

### Mettre à Jour l'App

```bash
cd /home/deploy/3d-viewer-app

# Récupérer les derniers changements
git pull origin main

# Reconstruire l'image Docker
docker-compose build

# Redémarrer
docker-compose up -d
```

---

## 🔄 CI/CD avec GitHub Actions (Optionnel)

Pour déployer automatiquement à chaque push sur `main` :

**Fichier** : `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/deploy/3d-viewer-app
            git pull origin main
            docker-compose build
            docker-compose up -d
```

**Setup** :
1. Va sur GitHub → Repo Settings → Secrets
2. Ajoute :
   - `SERVER_IP` : ton IP serveur
   - `SERVER_USER` : `deploy`
   - `SSH_PRIVATE_KEY` : ta clé privée SSH

---

## 🔍 Monitoring & Logs

### Vérifier la Santé de l'App

```bash
# Health check endpoint
curl http://localhost:3000/health

# Vérifier les ressources
docker stats

# Vérifier l'espace disque
df -h

# Vérifier la RAM/CPU
free -h
top
```

### Logs Centralisés

```bash
# Voir tous les logs
docker-compose logs -f

# Logs Nginx
tail -f /home/deploy/3d-viewer-app/logs/nginx/access.log
tail -f /home/deploy/3d-viewer-app/logs/nginx/error.log

# Logs App
tail -f /home/deploy/3d-viewer-app/logs/app-out.log
```

### Alertes (Optionnel)

Ajoute un service de monitoring :
- **Uptime Robot** (gratuit)
- **Statuspage.io** (gratuit)
- **DataDog** (payant mais complet)

---

## 🚨 Troubleshooting

### ❌ L'app ne démarre pas

```bash
# Vérifier les logs
docker-compose logs app

# Reconstruire
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### ❌ Nginx ne répond pas

```bash
# Vérifier la config Nginx
docker exec 3d-viewer-nginx nginx -t

# Recharger Nginx
docker-compose restart nginx

# Vérifier les logs
docker-compose logs nginx
```

### ❌ Out of memory

```bash
# Vérifier la RAM
docker stats

# Limiter la mémoire (dans docker-compose.yml)
services:
  app:
    mem_limit: 512m
```

### ❌ Certificat SSL expiré

```bash
# Renouveler
certbot renew

# Forcer renouvellement
certbot renew --force-renewal
```

---

## 📈 Scaling (Quand tu as beaucoup de traffic)

### Augmenter les Instances

**Dans docker-compose.yml** :
```yaml
services:
  app:
    deploy:
      replicas: 3  # 3 instances de l'app
```

Nginx va automatiquement load-balancer entre elles.

### Augmenter les Ressources du Serveur

- Mettre à jour ton VPS (plus de RAM, CPU)
- Migrer vers un serveur plus puissant

---

## 💡 Bonnes Pratiques

✅ **À faire** :
- Faire des backups régulières
- Monitorer les logs
- Maintenir Docker/Node à jour
- Utiliser des environnements séparés (dev/staging/prod)
- Configurer un domaine avec HTTPS

❌ **À éviter** :
- Ne pas laisser de credentials en dur
- Ne pas utiliser `root` pour l'app
- Ne pas exposer le port 3000 directement (utiliser Nginx)
- Ne pas ignorer les mises à jour de sécurité

---

## 📞 Support & Questions

Si tu rencontres des problèmes :

1. Vérifier les logs : `docker-compose logs -f`
2. Vérifier la connectivité : `curl http://localhost:3000`
3. Vérifier les resources : `docker stats`
4. Vérifier Nginx : `docker exec 3d-viewer-nginx nginx -t`

---

## 🎯 Récapitulatif

| Étape | Commande | Temps |
|-------|----------|-------|
| SSH au serveur | `ssh root@IP` | 1 min |
| Exécuter script | `./deploy.sh main` | 5 min |
| Tester | `curl http://IP:3000` | 1 min |
| Configurer domain | Pointer DNS | 5 min |
| Activer HTTPS | `certbot --nginx` | 2 min |
| **Total** | | **~15 min** |

**C'est tout ! Ton app est maintenant en production avec contrôle total.** 🚀

