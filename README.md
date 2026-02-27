# Pharma - Logiciel de Gestion de Pharmacie

Pharma est une application de bureau moderne et performante conçue pour optimiser la gestion quotidienne des pharmacies. Buildée avec **Electron**, **React** et **Prisma**, elle offre une solution robuste pour la gestion des stocks, des ventes et du personnel.

## 🚀 Fonctionnalités Clés

### 📦 Gestion des Stocks de Précision
*   **Gestion par Lots (Batches)** : Suivi rigoureux des produits par numéro de lot.
*   **Contrôle des Expirations** : Alertes automatiques pour les produits approchant de leur date de péremption.
*   **Stratégie FEFO** : Déduction automatique des stocks basée sur le principe *First Expired, First Out* pour minimiser les pertes.
*   **Alertes de Stock Bas** : Notifications pour le réapprovisionnement.

### 💰 Point de Vente (POS) & Ventes
*   **Interface Intuitive** : Processus de vente rapide pour les caissiers.
*   **Multi-Paiements** : Prise en charge de divers modes de paiement (Espèces, etc.).
*   **Historique des Ventes** : Suivi détaillé de toutes les transactions effectuées.

### 🕒 Gestion des Sessions de Caisse (Shifts)
*   **Ouverture/Fermeture de Session** : Contrôle strict des fonds de caisse.
*   **Réconciliation Financière** : Calcul automatique des écarts de caisse lors de la fermeture.
*   **Rapports par Session** : Vue d'ensemble des performances par utilisateur et par shift.

### 👥 Administration & Sécurité
*   **Gestion des Rôles (RBAC)** : Accès différencié pour les administrateurs, pharmaciens et caissiers.
*   **Gestion des Fournisseurs** : Base de données centralisée des partenaires et commandes.

## 🛠️ Stack Technique

*   **Frontend** : [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool** : [Vite](https://vitejs.dev/)
*   **Desktop Shell** : [Electron](https://www.electronjs.org/)
*   **Base de Données** : [SQLite](https://www.sqlite.org/)
*   **ORM** : [Prisma v7](https://www.prisma.io/) (utilisant les Driver Adapters pour SQLite)
*   **Gestion d'État** : [Zustand](https://github.com/pmndrs/zustand)
*   **Mises à jour** : [Electron Updater](https://www.electron.build/auto-update)

## 🛠️ Installation & Développement

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

## 🏗️ Architecture du Projet

```text
├── electron/          # Processus principal Electron (Main & Preload)
├── src/               # Code source Frontend (React)
│   ├── app/           # Features, Stores, Components
│   └── assets/        # Ressources statiques
├── prisma/            # Schéma de base de données et migrations
└── public/            # Assets publics
```

## 📝 Licence

Ce projet est la propriété de [Nom/Entreprise]. Tous droits réservés.
