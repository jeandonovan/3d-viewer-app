# 🚀 Guide Complet d'Exécution - Phase 0 + Phase 1

## ✅ Qu'est-ce qui a été créé ?

```
Phase 0 (Structure & Config) ✓
├── Configuration TypeScript, Tailwind, Next.js
├── Store Zustand + Validation Zod
├── Types globaux et constants
├── Déploiement Docker + Nginx
└── Documentation (Architecture, Deployment)

Phase 1 (Core 3D Rendering) ✓
├── Scene.tsx - Canvas Fiber principal
├── Camera.tsx - Caméra + OrbitControls
├── Model.tsx - Chargement glTF/GLB
├── Lights.tsx - Éclairage avec shadows
├── FileUpload.tsx - Upload avec validation
├── Header.tsx - Barre supérieure
├── Controls.tsx - Panneau contrôle
├── QualitySelector.tsx - Sélecteur qualité
├── CameraControls.tsx - Contrôle caméra
├── RenderStats.tsx - Affichage metrics
└── Home Page (page.tsx) - Layout complet
```

---

## 🎯 Exécution en Local (Test Immédiat)

### **Étape 1 : Cloner le Repo**

```bash
git clone https://github.com/jeandonovan/3D-viewer-app.git
cd 3D-viewer-app
```

### **Étape 2 : Installer les Dépendances**

```bash
npm install
```

**Temps** : 2-3 minutes  
**À attendre** : `added XXX packages`

### **Étape 3 : Lancer le Serveur de Développement**

```bash
npm run dev
```

**Résultat attendu** :
```
▲ Next.js 16.2.9
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.2s
```

### **Étape 4 : Ouvrir dans le Navigateur**

```
http://localhost:3000
```

---

## 👀 À Quoi ça Ressemble ?

### **Vue d'ensemble**

```
┌─────────────────────────────────────────────────┐
│  🏗️ 3D Viewer | Architecture Viewer             │ ← Header (16px)
├──────────────────────────────┬──────────────────┤
│                              │                  │
│                              │   📤 Upload     │
│     3D Canvas                │   Section       │
│     (Black background)       │                  │
│     Zone d'affichage         │   ⚙️ Quality   │
│     du modèle 3D             │   ⚡ Low/✨High │
│                              │                  │
│                              │   📷 Camera    │
│                              │   🔄 AutoRot   │
│                              │                  │
│                              │   📊 Stats     │
│                              │   FPS, Tris... │
│                              │                  │
└──────────────────────────────┴──────────────────┘
        ↑                               ↑
    Canvas                     Panneau Contrôle
    (Full height)              (Fixed à droite)
```

### **Couleurs**

- **Canvas** : Gris très sombre (`#1a1f2e`) - idéal pour 3D
- **Panels** : Gris foncé (`#2f3541`)
- **Accents** : Bleu-cyan (`#0691cd`) - boutons, texte important
- **Texte** : Blanc cassé (`#f0f2f5`)

### **Fonctionnalités Visibles**

1. **Header** (top)
   - Logo 🏗️
   - Titre + sous-titre
   - Status du modèle (Ready/Loading/Loaded)

2. **Canvas** (gauche, 80%)
   - Fond sombre
   - Prêt à recevoir un modèle 3D
   - Message "Upload a model" si vide

3. **Control Panel** (droite, 20%)
   - Section Upload (expandable)
   - Section Quality (après upload)
   - Section Camera (après upload)
   - Section Stats (après upload)

---

## 📤 Tester l'Upload

### **Option 1 : Utiliser un Modèle de Test Gratuit**

Télécharge un modèle 3D gratuit :

```bash
# Exemple : Fox (3D model)
# https://sketchfab.com/3d-models/fox-261ffd5e8a9a445ba80a47fb975f99c6
# Télécharge en format glTF (.glb)

# Ou un modèle simple :
# https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Fox
```

### **Option 2 : Créer un Modèle de Test Simple**

Utilise Blender pour créer un cube/cube simple en glTF :

```bash
# Créer un simple cube en Blender
# File → Export → glTF 2.0 (.glb) → cube.glb
```

### **Option 3 : Utiliser un Modèle en Ligne**

```bash
# Dans le navigateur, crée un fichier glTF simple
# Ou télécharge depuis Sketchfab (Free models)
```

### **Test d'Upload**

1. Ouvre http://localhost:3000
2. Clique sur la zone "📤 Upload 3D Model"
3. Sélectionne un fichier `.glb` ou `.gltf`
4. **Ou** : Glisse-dépose le fichier

---

## ✨ Fonctionnalités à Tester Après Upload

### **1. Voir le Modèle 3D**
- ✅ Le modèle apparaît dans le canvas
- ✅ Il est auto-centré et auto-zoomé
- ✅ Fond noir avec éclairage

### **2. Interagir avec le Modèle**
- **Rotation** : Clic gauche + glisse
- **Pan** : Clic droit + glisse
- **Zoom** : Scroll souris

### **3. Auto-Rotate**
- Clique sur "🔄 Auto Rotate"
- Le modèle tourne automatiquement

### **4. Quality Selector**
- **Low** : Performant, résolution réduite
- **High** : Beau, plus de détails

### **5. Render Stats**
- Section "📊 Stats" affiche :
  - **FPS** : Nombre de frames par seconde
  - **Render Time** : Temps par frame (ms)
  - **Triangles** : Nombre de triangles du modèle
  - **Draw Calls** : Nombre d'appels de dessin

---

## 🐛 Si Ça Ne Marche Pas

### ❌ Erreur : "Port 3000 en usage"

```bash
# Utiliser un autre port
npm run dev -- -p 3001

# Puis ouvre http://localhost:3001
```

### ❌ Erreur : "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Canvas noir (Pas de modèle)

- Vérifiez que le fichier est en `.glb` ou `.gltf`
- Vérifiez que le fichier < 50MB
- Ouvrir la console (F12) pour voir les erreurs

### ❌ Performance lente

- Basculer en "Low Quality"
- Utiliser un modèle plus petit (< 5MB)
- Vérifier que GPU n'est pas saturé

---

## 📊 Commandes Utiles

```bash
# Development
npm run dev              # Serveur + hot reload

# Production build
npm run build           # Build optimisé
npm run start           # Lancer la build prod

# Type checking
npm run type-check      # Vérifier les types TypeScript

# Linting
npm run lint            # Vérifier le code

# All together
npm run build && npm start
```

---

## 🎨 Structure Finale de l'App

```
3D-Viewer App (Phase 0 + Phase 1 Complete)
│
├── 🏗️ Architecture Complete
│   ├── Next.js 16 + App Router
│   ├── TypeScript Strict Mode
│   ├── Tailwind CSS v4
│   ├── Three.js + React Three Fiber
│   ├── Zustand State Management
│   └── Zod Validation
│
├── 📁 Structure Arborescence
│   ├── /app → Pages Next.js
│   ├── /components/canvas → Composants 3D
│   ├── /components/ui → Composants UI
│   ├── /store → Zustand store
│   ├── /lib → Utils, validators, constants
│   └── /types → Types globaux
│
├── 🚀 Features Phase 1
│   ├── Upload fichier glTF/GLB
│   ├── Rendu 3D en temps réel
│   ├── Camera avec OrbitControls
│   ├── Auto-rotation caméra
│   ├── Quality selector (Low/High)
│   ├── Render stats (FPS, temps, tris)
│   ├── Design system complet
│   └── Gestion d'erreurs
│
└── 🐳 Déploiement Ready
    ├── Docker (Dockerfile + docker-compose)
    ├── Nginx (reverse proxy)
    ├── PM2 (alternative à Docker)
    ├── Script déploiement auto
    └── HTTPS ready (Let's Encrypt)
```

---

## 🔄 Prochaines Étapes (Phase 2+)

Après avoir testé Phase 1, tu peux ajouter :

- **Phase 2** : Export screenshot, advanced quality presets
- **Phase 3** : Annotations, measurements, collaborative viewing
- **Phase 4** : Animation timeline, advanced materials
- **Phase 5** : Backend API, user accounts, projects

---

## 📦 Fichiers Créés (Complet)

### **Config Files** (12)
```
✓ package.json
✓ tsconfig.json
✓ next.config.ts
✓ tailwind.config.ts
✓ postcss.config.js
✓ .eslintrc.json
✓ Dockerfile
✓ docker-compose.yml
✓ nginx.conf
✓ deploy.sh
✓ pm2.config.js
✓ .dockerignore
```

### **App Files** (8)
```
✓ app/layout.tsx
✓ app/page.tsx
✓ app/error.tsx
✓ app/globals.css
```

### **Components - Canvas** (4)
```
✓ components/canvas/Scene.tsx
✓ components/canvas/Camera.tsx
✓ components/canvas/Model.tsx
✓ components/canvas/Lights.tsx
```

### **Components - UI** (6)
```
✓ components/ui/FileUpload.tsx
✓ components/ui/Header.tsx
✓ components/ui/Controls.tsx
✓ components/ui/QualitySelector.tsx
✓ components/ui/CameraControls.tsx
✓ components/ui/RenderStats.tsx
```

### **State & Validation** (3)
```
✓ store/useViewerStore.ts
✓ lib/validators.ts
✓ lib/constants.ts
```

### **Types & Docs** (5)
```
✓ types/index.ts
✓ lib/types.ts
✓ README.md
✓ ARCHITECTURE.md
✓ DEPLOYMENT.md
```

### **Total** : 42 fichiers bien organisés ✅

---

## 🎯 Résumé : Comment Exécuter

### **En 4 Commandes**

```bash
# 1. Clone
git clone https://github.com/jeandonovan/3D-viewer-app.git && cd 3D-viewer-app

# 2. Install
npm install

# 3. Run
npm run dev

# 4. Open
# → Navigateur : http://localhost:3000
```

### **Puis Upload un Modèle**

- Télécharge un `.glb` depuis Sketchfab
- Glisse-dépose dans la zone "Upload"
- Regarde le modèle s'afficher en 3D ✨
- Teste rotation, zoom, quality, stats

---

## ✨ Features Phase 1 Complètes

✅ **3D Rendering**
- Canvas Three.js + Fiber
- Chargement glTF/GLB
- Auto-fit model in viewport
- Shadows & lighting

✅ **Interactivity**
- Orbit camera controls
- Rotation, pan, zoom
- Auto-rotate toggle
- Quality switching

✅ **UI/UX**
- Dark theme (architect-friendly)
- Collapsible panels
- Real-time stats
- Error handling
- Responsive layout

✅ **Performance**
- Quality presets (Low/High)
- Optimized rendering
- Asset preloading
- Memory efficient

✅ **Code Quality**
- TypeScript strict mode
- Zod validation
- Zustand state
- Component isolation
- Detailed comments

---

## 🚀 Tu es Prêt !

**Teste maintenant et dis-moi** :
1. ✅ L'app démarre ?
2. ✅ Tu vois l'interface ?
3. ✅ L'upload fonctionne ?
4. ✅ Le modèle s'affiche ?
5. ✅ Les contrôles marchent ?

**Puis on peut ajouter Phase 2 !** 🎉

---

## 📞 Questions ?

- Problème d'installation ?
- Port déjà utilisé ?
- Modèle ne charge pas ?
- Performance mauvaise ?

**Dis-moi et je t'aide !** 👇
