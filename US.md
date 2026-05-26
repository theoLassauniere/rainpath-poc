# User Stories — RainPath POC

## Epic 1 — Gestion des workflows

- **US-01** : En tant que chef de labo, je peux voir la liste de mes workflows existants
- **US-02** : En tant que chef de labo, je peux créer un nouveau workflow (vierge)
- **US-03** : En tant que chef de labo, je peux ouvrir un workflow existant pour l'éditer
- **US-04** : En tant que chef de labo, je peux sauvegarder mon workflow en cours d'édition
- **US-04.1** : En tant que chef de labo, je veux pouvoir valider la relance, ou non, puis la supprimer

## Epic 2 — Canvas / Éditeur

- **US-05** : Je peux ajouter un node sur le canvas via un panneau latéral
- **US-06** : Je peux déplacer un node librement sur le canvas
- **US-07** : Je peux supprimer un node du canvas
- **US-08** : Je peux relier deux nodes entre eux (créer une arête)
- **US-09** : Je peux supprimer une arête existante
- **US-10** : Je peux éditer les paramètres d'un node (panneau ou modale)

## Epic 3 — Types de nodes

- **US-11** : Node *Départ* — "Examen effectué" (point d'entrée unique)
- **US-12** : Nodes *Envoi* — Email / SMS / WhatsApp / Courrier postal
- **US-13** : Node *Délai* — "Attendre X jours"
- **US-14** : Node *Condition* — branchement selon disponibilité de donnée ou résultat d'action
- **US-15** : Node *Fin* — point de sortie du workflow

## Epic 4 — Bonus

- **US-16** : Vue "dossier patient fictif" avec avancement simulé dans le workflow
