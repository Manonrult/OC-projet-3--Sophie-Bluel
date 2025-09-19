# Sophie Bluel - Création d'une page web dynamique avec JavaScript
Ce projet a été réalisé dans le cadre de la formation **Développeur web** d'OpenClassrooms. L'objectif était de créer une page web dynamique pour l'architecte d'intérieur Sophie Bluel.

J'ai pour cela développé les fonctionnalités suivantes :
* La page d'accueil avec une galerie de travaux filtrable.
* La gestion de l'état utilisateur (connexion/déconnexion).
* L'ajout d'une modale pour interagir avec la galerie (ajout et suppression de photos).

### Fonctionnalités Implémentées

* **Affichage dynamique des travaux** : Récupération des données de l'API pour afficher les projets et les catégories dans la galerie et les filtres.
* **Filtrage des projets** : Mise en place d'un système de filtres interactif qui permet de trier les travaux par catégorie.
* **Gestion de l'authentification** :
    * Mise en place d'une page de connexion pour l'administrateur.
    * Vérification de l'authentification de l'utilisateur.
    * Affichage d'une barre d'édition et des fonctionnalités d'administration après la connexion.
    * Gestion de la déconnexion de l'utilisateur.
* **Modale d'édition** :
    * Création d'une modale pour visualiser, supprimer et ajouter des projets.
    * Communication avec l'API pour la suppression et l'ajout de projets.
    * Validation du formulaire d'ajout de projet pour s'assurer que toutes les données requises sont présentes avant l'envoi.
 
 ### Technologies et Outils Utilisés

* **JavaScript (ES6+)** : Pour la manipulation du DOM et la logique de l'application.
* **HTML5 & CSS3** : Pour la structure et le style du site.
* **API REST** : Utilisation des méthodes `GET`, `POST` et `DELETE` pour interagir avec le backend.
* **Google Chrome DevTools** : Pour le débogage et l'analyse des requêtes réseau.

## Architecture

Ce repo git contient les 2 briques logicielles du projet 
- Frontend
- Backend
  

## Pour le lancer le code
###Cloner le dépôt :###
    ```bash
    git clone [https://github.com/Manonrult/OC-projet-3--Sophie-Bluel.git](https://github.com/Manonrult/OC-projet-3--Sophie-Bluel.git)
    ```
### Backend
Ouvrir le dossier Backend et lire le README.md

### Frontend
Ouvrir le dossier Frontend et lancer liveserver de votre IDE
 
## Astuce
 
Si vous désirez afficher le code du backend et du frontend, faites le dans 2 instances de VSCode différentes pour éviter tout problème

### Auteur

- **Manon Ruault** - Étudiante OpenClassrooms
