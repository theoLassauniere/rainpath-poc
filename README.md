# RainPath — Workflow Editor (POC)

Éditeur visuel de workflows de relance patient pour laboratoires d'anatomopathologie.  
Permet à un chef de laboratoire de dessiner, sauvegarder et gérer des séquences de relance multi-canaux (Email, SMS, WhatsApp, Courrier postal).

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript, Vite, @xyflow/react, Zustand, Tailwind CSS v4 |
| Backend | NestJS, Prisma 6, SQLite |
| API | REST — `http://localhost:3000` |

---

## Lancer avec Docker (le plus simple)

Prérequis : **Docker** + **Docker Compose** (Docker Desktop suffit).

```bash
docker compose up -d --build
```

Puis ouvrir **http://localhost:8080**.

L'application est livrée avec un **workflow d'exemple** (le scénario de la spec :
J+7 email → bascule WhatsApp/SMS si échec → courrier à J+15 → fin à J+30),
inséré automatiquement au premier démarrage.

| Service    | Base            | Rôle                                                            |
|------------|-----------------|-----------------------------------------------------------------|
| `frontend` | `nginx:alpine`  | Sert le build Vite et proxifie `/api/*` vers le backend         |
| `backend`  | `node:22-alpine`| API NestJS (port 3000 interne) + synchro du schéma Prisma       |

**Volumes :**
- `backend-data` (volume nommé) → persiste la base SQLite (`/data/dev.db`).
- `./seed` (monté en lecture seule) → contient `example-workflow.json`. Le backend
  l'insère **seulement si la base est vide** (seed idempotent, voir `backend/prisma/seed.js`).

```bash
docker compose down       # stoppe les conteneurs, conserve la base
docker compose down -v    # + réinitialise la base (réinjecte le workflow d'exemple)
```

---

## Prérequis (développement local sans Docker)

- **Node.js** >= 20
- **npm** >= 10

---

## Lancer le projet

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev   # crée la base SQLite (dev.db)
npm run start:dev        # démarre sur http://localhost:3000
```

> Documentation Swagger disponible sur [`http://localhost:3000/docs`](http://localhost:3000/docs)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # démarre sur http://localhost:5173
```

> Les appels `/api/*` sont proxyfiés vers le backend via Vite.

---

## Structure du projet

```
rainpath-poc/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma de la base de données
│   │   └── migrations/         # Historique des migrations SQL
│   └── src/
│       ├── prisma/             # Service Prisma (global)
│       └── workflows/          # Module workflows (controller, service, DTOs)
├── frontend/
│   └── src/
│       ├── api/                # Client HTTP (axios)
│       ├── pages/              # Pages React (liste, éditeur)
│       ├── store/              # State global (Zustand)
│       └── types/              # Types TypeScript partagés
└── US.md                       # User stories du projet
```

---

## API — Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/workflows` | Liste tous les workflows (résumé) |
| `GET` | `/workflows/:id` | Récupère un workflow complet (nodes + edges) |
| `POST` | `/workflows` | Crée un nouveau workflow |
| `PATCH` | `/workflows/:id` | Met à jour un workflow |
| `DELETE` | `/workflows/:id` | Supprime un workflow |

---

## Modèle de données

### Workflow

| Champ | Type | Description |
|---|---|---|
| `id` | `Int` | Identifiant auto-incrémenté |
| `name` | `String` | Nom du workflow |
| `description` | `String?` | Description optionnelle |
| `status` | `DRAFT \| VALIDATED \| CANCELLED` | État du workflow |
| `nodes` | `String` (JSON) | Tableau de nœuds sérialisé |
| `edges` | `String` (JSON) | Tableau d'arêtes sérialisé |
| `createdAt` | `DateTime` | Date de création |
| `updatedAt` | `DateTime` | Date de dernière modification |

> La base de données stocke uniquement la donnée brute (JSON). La validation métier est assurée par le backend.

---

## Variables d'environnement

### Backend (`.env`)

```env
DATABASE_URL="file:./dev.db"
```

Un fichier `.env.example` est disponible à la racine du dossier `backend/`.
