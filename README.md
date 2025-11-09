# SockMatch – Application de rencontre pour chaussettes

## À propos du projet
**SockMatch** est une application web full-stack humoristique inspirée des applications de rencontre, mais pensée pour... les chaussettes.  
L’objectif du projet est de concevoir un système d’authentification complet et une logique de “match” simple, tout en explorant les bases d’une architecture full-stack moderne avec **Node.js**, **Express**, **MongoDB** et **Bootstrap 5**.

Ce projet m’a permis de travailler sur la mise en place d’une API REST sécurisée, la gestion des utilisateurs, et la création d’une interface responsive sans framework frontend.

## Structure du projet
├── backend/ # API REST Node.js
│ ├── config/ # Configuration serveur et base de données
│ ├── controllers/ # Logique métier (auth, profil, match)
│ ├── middleware/ # Vérifications JWT, validation, sécurité
│ ├── models/ # Schémas Mongoose
│ ├── routes/ # Définition des routes API
│ └── server.js # Point d’entrée du serveur
└── frontend/ # Interface utilisateur
├── index.html # Page principale
├── js/ # Scripts frontend
└── css/ # Feuilles de style Bootstrap personnalisées

## Fonctionnalités principales
- Création de compte et connexion sécurisée  
- Gestion de profil utilisateur (photo, description, préférences)  
- Système de “swipe” et de “match” entre utilisateurs  
- Stockage des données utilisateurs dans **MongoDB**  
- Interface claire et responsive avec **Bootstrap 5**

## Technologies utilisées
**Backend**
- Node.js  
- Express.js  
- MongoDB avec Mongoose  
- JSON Web Tokens (JWT)  
- bcrypt pour le hachage des mots de passe

**Frontend**
- HTML5 / CSS3  
- JavaScript (vanilla)  
- Bootstrap 5

## Installation

### Prérequis
- Node.js installé  
- npm ou yarn  
- MongoDB (local ou cloud)

### Étapes d’installation
```bash
git clone https://github.com/tonpseudo/SockMatch.git
cd SockMatch/backend
npm install
npm run dev
Configuration

Créer un fichier .env dans le dossier backend :
MONGO_URI="mongodb://localhost:27017/sockmatch"
JWT_SECRET="abtraore12345"
PORT=3000

Puis lancez le serveur et ouvrez index.html dans votre navigateur.

Sécurité et bonnes pratiques

Hachage des mots de passe avec bcrypt

Authentification basée sur JWT

Validation des données utilisateur

Séparation claire frontend / backend

Objectif pédagogique

SockMatch a été conçu comme un projet d’apprentissage full-stack.
Il m’a permis de :

Approfondir la gestion des utilisateurs et des sessions

Comprendre la communication entre un frontend statique et une API REST

Expérimenter la conception d’une interface responsive avec Bootstrap



Auteur

Abdoulaye Traoré





