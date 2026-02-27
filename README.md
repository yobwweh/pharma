# Pharma - Logiciel de Gestion de Pharmacie

Pharma est une application de bureau moderne et performante conçue pour optimiser la gestion quotidienne des pharmacies. Buildée avec **Electron**, **React** et **Prisma**, elle offre une solution robuste pour la gestion des stocks, des ventes et du personnel.

## Fonctionnalités Clés

###  Interface Dashboard Premium
*   **Design Moderne** : Refonte complète de l'interface avec une esthétique épurée et professionnelle (MUI v7).
*   **KPIs en Temps Réel** : Visualisation instantanée du Chiffre d'Affaires, nombre de ventes, panier moyen et produits vendus.
*   **Historique Détaillé** : Accès rapide aux transactions récentes avec consultation des détails par vente.
*   **Filtres Temporels** : Analyse des données par jour, semaine ou mois.

###  Gestion des Stocks & Inventaire (MAJ)
*   **Inventaire Centralisé** : Vue d'ensemble de tous les produits avec KPIs dédiés (Valeur du stock, Alertes rupture, Péremptions).
*   **Formulaire d'Ajout Avancé** : Saisie complète incluant Catégorie, Fabricant, Emplacement et Code-barres.
*   **Gestion par Lots Automatisée** : Création automatique d'un lot initial lors de l'ajout d'un produit.
*   **Recherche & Filtrage** : Système performant de recherche par nom, SKU ou statut (En Stock, Rupture, Périmé).

###  Point de Vente (POS) & Ventes
*   **Interface Intuitive** : Processus de vente rapide optimisé pour fluidifier le passage en caisse.
*   **Gestion du Panier** : Ajout/Suppression simplifié et calcul automatique des totaux.
*   **Multi-Paiements** : Prise en charge des Espèces, Mobile Money et Cartes Bancaires.

###  Gestion des Sessions de Caisse (Shifts)
*   **Ouverture/Fermeture de Session** : Contrôle strict des fonds de caisse.
*   **Réconciliation Financière** : Calcul automatique des écarts de caisse lors de la fermeture.
*   **Rapports par Session** : Vue d'ensemble des performances par utilisateur et par shift.

###  Administration & Sécurité
*   **Gestion des Rôles (RBAC)** : Accès différencié pour les administrateurs, pharmaciens et caissiers.
*   **Gestion des Fournisseurs** : Base de données centralisée des partenaires et commandes.

##  Stack Technique

*   **Frontend** : [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool** : [Vite](https://vitejs.dev/)
*   **Desktop Shell** : [Electron](https://www.electronjs.org/)
*   **Base de Données** : [SQLite](https://www.sqlite.org/)
*   **ORM** : [Prisma v7](https://www.prisma.io/) (utilisant les Driver Adapters pour SQLite)
*   **Gestion d'État** : [Zustand](https://github.com/pmndrs/zustand)
*   **Mises à jour** : [Electron Updater](https://www.electron.build/auto-update)

##  Installation & Développement

### Prérequis
*   [Node.js](https://nodejs.org/) (version LTS recommandée)
*   npm ou yarn

### Installation
```bash
# Cloner le dépôt
git clone <url-du-depot>

# Installer les dépendances
npm install
```

### Développement
```bash
# Lancer l'application en mode dev (Vite + Electron)
npm run dev
```

### Build (Production)
```bash
# Générer l'exécutable pour Windows/macOS/Linux
npm run build
```

##  Architecture du Projet

```text
├── electron/               # Processus principal Electron
│   ├── main.ts             # Logique principale, IPC handlers, Base de données
│   └── preload.ts          # Exposition de l'API sécurisée au Frontend
├── prisma/                 # Configuration de la base de données
│   ├── schema.prisma       # Modèles de données (User, Product, Sale, Batch...)
│   └── migrations/         # Historique des changements de BDD
├── src/                    # Code source Frontend (React + Vite)
│   ├── app/                # Architecture Applicative
│   │   ├── common/         # Composants et utilitaires partagés (ex: StatCard, DataGridTable)
│   │   ├── features/       # Modules métiers (Feature-First Architecture)
│   │   │   ├── dashboard/  # Statistiques et graphiques premium
│   │   │   ├── inventory/  # Liste des stocks, KPIs et Formulaires
│   │   │   ├── sales/      # Point de vente (POS) et interface caisse
│   │   │   └── auth/       # Gestion du login et des sessions
│   │   ├── layouts/        # Gabarits de structure (ex: Sidebar, MainLayout)
│   │   ├── theme/          # Configuration visuelle (MUI)
│   │   └── types/          # Types TypeScript globaux
│   ├── assets/             # Images et icônes
│   └── main.tsx            # Point d'entrée de l'application React
└── README.md               # Documentation du projet
```

##  Licence

Ce projet est la propriété de Yoboué N'guessan Armel Constant/ Future Compagnie. Tous droits réservés.
