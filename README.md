# RainPath — Éditeur visuel de workflows de relance

Mini-application web permettant à un **chef de laboratoire d'anatomopathologie** de
concevoir, à la manière de n8n ou Zapier, ses propres **séquences de relance de paiement
patient** sous forme de graphe à nœuds.

Selon les informations disponibles sur le patient (email connu ? numéro ?), le résultat
d'un envoi (mail rejeté ? ouvert ?) et des délais, le workflow branche dynamiquement vers
le canal de communication suivant : **Email, SMS, WhatsApp ou Courrier postal**.

> ℹ️ Aucun envoi réel n'est effectué : les canaux sont factices. Le projet se concentre sur
> la **configuration** et la **persistance** des workflows.

---

## Sommaire

- [Aperçu fonctionnel](#aperçu-fonctionnel)
- [Stack & choix de librairies](#stack--choix-de-librairies)
- [Architecture](#architecture)
- [Modèle de données & règles métier](#modèle-de-données--règles-métier)
- [Démarrage avec Docker](#démarrage-avec-docker-le-plus-simple)
- [Démarrage en local](#démarrage-en-local-développement)
- [Tests](#tests)
- [API REST](#api-rest)
- [Structure du dépôt](#structure-du-dépôt)
- [Variables d'environnement](#variables-denvironnement)

---

## Aperçu fonctionnel

- **Éditeur de graphe** : ajouter, déplacer, supprimer des nœuds ; relier/délier les nœuds.
- **Types de nœuds** : Départ (« Examen effectué »), Envoi (Email / SMS / WhatsApp / Courrier),
  Délai (« attendre X jours »), Condition (disponibilité d'une donnée ou résultat d'une action,
  avec branches **Oui / Non**), Fin.
- **Édition des paramètres** d'un nœud (délai, message factice, type de condition…).
- **Persistance** : sauvegarde, liste et rechargement des workflows via une API REST.
- **Cycle de vie** d'un workflow : `Brouillon → Validé → Annulé`, avec règles de transition.
- **Confort** : mode clair/sombre, organisation de la liste par onglets de statut.

---

## Stack & choix de librairies

| Couche  | Technologies |
|---------|--------------|
| Frontend | React 19 + TypeScript, Vite, **@xyflow/react** (React Flow v12), Zustand, Tailwind CSS v4, React Router, axios |
| Backend  | **NestJS**, **Prisma 6**, **SQLite**, class-validator, Swagger |
| Tests    | Jest (back), Vitest + Testing Library (front) |
| Conteneurs | Docker, Docker Compose, nginx |

### Pourquoi ces librairies

- **@xyflow/react (React Flow v12)** — cœur de l'éditeur. Choisi pour sa **scalabilité** et son
  caractère **générique/extensible** : c'est le standard de l'industrie pour les éditeurs de
  workflow (utilisé notamment par n8n), avec un excellent support TypeScript, des nœuds et
  arêtes entièrement personnalisables (handles `Oui`/`Non` pour les conditions), et la
  virtualisation pour absorber de grands graphes. Une alternative plus simple aurait suffi pour
  le POC, mais ce choix prépare une montée en charge réelle.
- **Zustand** — état du graphe (nœuds, arêtes, « dirty », métadonnées). Store minimaliste à base
  de hooks, sans le boilerplate de Redux, avec des sélecteurs performants bien adaptés aux
  re-rendus fréquents de React Flow.
- **Tailwind CSS v4** — pour livrer rapidement une UI soignée et cohérente (le sujet insiste sur
  la qualité de l'UX/UI), avec gestion native du mode sombre.
- **React Router** — navigation entre la liste, l'éditeur et les réglages.
- **axios** — client HTTP concis, avec `baseURL` `/api` proxifié vers le backend.
- **Vite** — démarrage et build quasi instantanés.

Côté backend, **NestJS** et **Prisma** sont imposés par le sujet. NestJS apporte une
architecture modulaire (DI, modules, DTO validés déclarativement) ; Prisma fournit un ORM
typé de bout en bout. **SQLite** est amplement suffisant pour ce POC (zéro configuration,
fichier unique facile à conteneuriser). **Swagger** documente l'API automatiquement sur `/docs`.

---

## Architecture

Monorepo à deux applications, communiquant via une API REST.

```
Navigateur
   │  (UI React + React Flow)
   ▼
Frontend  ── état local : Zustand ──┐
   │  axios → /api/*                 │
   ▼                                 │
Backend (NestJS)                     │
   │  WorkflowsController            │  nodes/edges = graphe React Flow
   │  → WorkflowsService (règles)    │  sérialisé en JSON
   │  → PrismaService                │
   ▼                                 │
SQLite (dev.db) ─────────────────────┘
```

**Frontend** (`frontend/src/`)
- `pages/` — `WorkflowListPage` (liste + onglets de statut), `WorkflowEditorPage` (éditeur),
  `SettingsPage`.
- `components/editor/` — `WorkflowCanvas` (intégration React Flow), `NodePalette` (glisser-déposer),
  `PropertiesPanel` (édition des paramètres du nœud sélectionné).
- `components/nodes/` — un composant par type de nœud + `nodeConfig.ts` (palette, valeurs par défaut).
- `store/workflowStore.ts` — état du graphe (Zustand).
- `constants/workflowStatus.ts` — **source unique** des libellés de statut, classes du badge et
  règles de transition (`canValidate` / `canCancel` / `canDelete`), réutilisée par tous les composants.
- `api/workflows.ts` — client REST. `types/workflow.ts` — types partagés.

**Backend** (`backend/src/`)
- `workflows/` — `WorkflowsController` (routes REST), `WorkflowsService` (logique métier et règles
  de statut), DTOs validés via `class-validator`.
- `prisma/` — `PrismaService` (client Prisma global).
- `main.ts` — bootstrap, CORS, `ValidationPipe` global, Swagger sur `/docs`.

**Persistance** — les `nodes` et `edges` (structure native de React Flow) sont stockés en
**colonnes JSON sérialisées** : la base reste agnostique du format du graphe, et la validation
métier vit côté backend. Pratique et suffisant pour un POC ; un schéma relationnel fin
(table de nœuds / arêtes) serait l'étape suivante pour requêter le contenu des graphes.

---

## Modèle de données & règles métier

### Entité `Workflow`

| Champ | Type | Description |
|---|---|---|
| `id` | `Int` | Identifiant auto-incrémenté |
| `name` | `String` | Nom du workflow |
| `description` | `String?` | Description optionnelle |
| `status` | `DRAFT \| VALIDATED \| CANCELLED` | État du workflow |
| `nodes` | `String` (JSON) | Nœuds du graphe sérialisés |
| `edges` | `String` (JSON) | Arêtes du graphe sérialisées |
| `createdAt` / `updatedAt` | `DateTime` | Horodatage |

### Règles de transition de statut

- Un **brouillon** (`DRAFT`) peut être **validé**.
- Un workflow **validé** (`VALIDATED`) peut être **annulé**.
- Seuls un **brouillon** ou un workflow **annulé** peuvent être **supprimés**
  (un validé doit d'abord être annulé → réponse `409 Conflict` sinon).

Ces règles sont **appliquées côté backend** (`WorkflowsService`) et **reflétées côté frontend**
(`constants/workflowStatus.ts`) pour piloter l'affichage des actions.

---

## Démarrage avec Docker (le plus simple)

**Prérequis** : Docker + Docker Compose (Docker Desktop suffit). Aucune installation de Node requise.

```bash
docker compose up -d --build
```

Puis ouvrir **http://localhost:8080**.

L'application est livrée avec un **workflow d'exemple** — le scénario de la spec :
*J+7 email → bascule WhatsApp/SMS si échec → courrier à J+15 → fin à J+30* — inséré
automatiquement au premier démarrage.

| Service    | Image de base    | Rôle |
|------------|------------------|------|
| `frontend` | `nginx:alpine`   | Sert le build statique Vite et proxifie `/api/*` vers le backend |
| `backend`  | `node:22-alpine` | API NestJS (port 3000 interne) + synchronisation du schéma Prisma au démarrage |

**Volumes :**
- `backend-data` (volume nommé) → persiste la base SQLite (`/data/dev.db`).
- `./seed` (monté en lecture seule) → contient `example-workflow.json`. Le backend l'insère
  **uniquement si la base est vide** (seed idempotent, voir `backend/prisma/seed.js`).

```bash
docker compose down       # stoppe les conteneurs, conserve la base
docker compose down -v    # + réinitialise la base (réinjecte le workflow d'exemple)
```

> Pour proposer un autre workflow d'exemple : éditer `seed/example-workflow.json` puis relancer
> avec une base vierge (`docker compose down -v && docker compose up -d`).

---

## Démarrage en local (développement)

**Prérequis** : Node.js ≥ 20 et npm ≥ 10.

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev    # crée la base SQLite (dev.db) à partir des migrations
npm run start:dev         # API sur http://localhost:3000  (Swagger : /docs)
```

### 2. Frontend (dans un autre terminal)

```bash
cd frontend
npm install
npm run dev               # UI sur http://localhost:5173
```

> En dev, Vite proxifie les appels `/api/*` vers `http://localhost:3000`.
> En conteneur, c'est nginx qui assure ce proxy — le code frontend reste identique.

---

## Tests

```bash
# Backend — tests unitaires (Jest) : service + contrôleur workflows
cd backend && npm test

# Frontend — Vitest + Testing Library : constantes, StatusBadge, WorkflowCard
cd frontend && npm test
```

- **Backend** : règles de statut (transitions interdites → `409`), sérialisation JSON,
  `NotFound`, délégation contrôleur → service (Prisma mocké).
- **Frontend** : unitaires (`workflowStatus`, `StatusBadge`) et intégration (`WorkflowCard` :
  actions affichées selon le statut, callbacks, flux de confirmation de suppression).

---

## API REST

Base : `http://localhost:3000` (documentation interactive Swagger sur **`/docs`**).

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/workflows` | Liste des workflows (résumé) |
| `GET` | `/workflows/:id` | Workflow complet (nodes + edges) |
| `POST` | `/workflows` | Crée un workflow |
| `PATCH` | `/workflows/:id` | Met à jour un workflow (champs partiels, statut) |
| `DELETE` | `/workflows/:id` | Supprime un workflow |

---

## Structure du dépôt

```
rainpath-poc/
├── docker-compose.yml          # Orchestration frontend + backend + volumes
├── seed/
│   └── example-workflow.json   # Workflow d'exemple (monté en volume)
├── backend/
│   ├── Dockerfile              # Image backend (build multi-stage)
│   ├── docker-entrypoint.sh    # db push → seed → start
│   ├── nest-cli.json
│   ├── prisma/
│   │   ├── schema.prisma       # Modèle de données
│   │   ├── migrations/         # Historique des migrations SQL
│   │   └── seed.js             # Seed idempotent du workflow d'exemple
│   └── src/
│       ├── main.ts             # Bootstrap (CORS, validation, Swagger)
│       ├── prisma/             # PrismaService (module global)
│       └── workflows/          # Controller, service, DTOs (+ specs Jest)
└── frontend/
    ├── Dockerfile              # Build Vite → nginx
    ├── nginx.conf              # Proxy /api/* → backend
    └── src/
        ├── api/                # Client HTTP (axios)
        ├── components/         # editor/, nodes/, StatusBadge, WorkflowCard…
        ├── constants/          # workflowStatus (labels + règles, source unique)
        ├── contexts/           # ThemeContext (mode clair/sombre)
        ├── pages/              # Liste, Éditeur, Réglages
        ├── store/              # État du graphe (Zustand)
        ├── types/              # Types TypeScript partagés
        └── test/               # Setup Vitest
```

---

## Variables d'environnement

### Backend

| Variable | Local (`.env`) | Docker | Rôle |
|---|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | `file:/data/dev.db` | Emplacement de la base SQLite |
| `PORT` | `3000` (défaut) | `3000` | Port d'écoute de l'API |
| `SEED_FILE` | — | `/seed/example-workflow.json` | Workflow injecté au 1ᵉʳ démarrage |

Un fichier `backend/.env.example` est fourni.

> **Note** : en local, le schéma est appliqué via `prisma migrate dev` (migrations versionnées).
> En conteneur, l'entrypoint utilise `prisma db push` — plus simple et robuste pour un POC
> (synchronisation directe du schéma, sans risque de dérive de l'historique de migrations).
