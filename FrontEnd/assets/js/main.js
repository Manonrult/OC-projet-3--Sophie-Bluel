// main.js

// URL de l'API pour récupérer les œuvres (route GET /works de ton backend)
const apiUrlWorks = 'http://localhost:5678/api/works'; // ⚠️ VERIFIEZ ET ADAPTEZ LE PORT SI NECESSAIRE !

// ➡️  Fonction pour afficher les œuvres dans la galerie
function afficherGalerie(works) {
    console.log("➡️ Fonction afficherGalerie() appelée dans main.js avec les œuvres :", works); // ✅ LOG
    const galleryDiv = document.querySelector(".gallery"); // ✅ Sélectionne l'élément HTML de ta galerie (vérifie la classe ou l'ID dans ton index.html)

    // ⚠️  VIDE le contenu HTML de la galerie avant de la remplir (important si tu recharges la page)
    galleryDiv.innerHTML = '';

    works.forEach(work => { // Pour chaque œuvre dans le tableau 'works'
        // Crée les éléments HTML pour chaque œuvre (figure, image, légende)
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");

        imageElement.src = work.imageUrl; // ✅ Nom du champ "imageUrl" CORRECT d'après Swagger
        imageElement.alt = work.title;   // ✅ Nom du champ "title" CORRECT d'après Swagger
        const captionElement = document.createElement("figcaption");
        captionElement.textContent = work.title; // ✅ Nom du champ "title" CORRECT d'après Swagger

        // Ajoute les éléments <img> et <figcaption> à l'élément <figure>
        figureElement.appendChild(imageElement);
        figureElement.appendChild(captionElement);

        // Ajoute l'élément <figure> (qui représente une œuvre) à l'élément <div class="gallery">
        galleryDiv.appendChild(figureElement);
    });
    console.log("✅ Galerie principale mise à jour visuellement dans main.js."); // ✅ LOG
}

// ➡️  Fonction pour créer et afficher le menu de catégories
function afficherMenuCategories(categories) {
    console.log("➡️ Fonction afficherMenuCategories() appelée dans main.js avec les catégories :", categories); // ✅ LOG
    const filtersDiv = document.querySelector(".filters");
    filtersDiv.innerHTML = '';

    // 1. Bouton "Tous"
    const tousButton = document.createElement("button");
    tousButton.textContent = "Tous";
    tousButton.classList.add("filter-button");

    // ✅ Ajoute un gestionnaire d'événement au bouton "Tous" : quand on clique, appelle filtrerGalerieParCategorie("Tous")
    tousButton.addEventListener("click", function () {
        filtrerGalerieParCategorie("Tous"); // ✅ Appelle filtrerGalerieParCategorie avec la catégorie "Tous"
    });

    filtersDiv.appendChild(tousButton);

    // 2. Boutons de catégorie
    categories.forEach(categoryName => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = categoryName;
        categoryButton.classList.add("filter-button");

        // ✅ Ajoute un gestionnaire d'événement à chaque bouton de catégorie : quand on clique, appelle filtrerGalerieParCategorie(nomDeLaCategorie)
        categoryButton.addEventListener("click", function () {
            filtrerGalerieParCategorie(categoryName); // ✅ Appelle filtrerGalerieParCategorie avec le nom de la catégorie
        });

        filtersDiv.appendChild(categoryButton);
    });
    console.log("✅ Menu des catégories mis à jour visuellement dans main.js."); // ✅ LOG
}

// ➡️  Fonction pour FILTRER la galerie par catégorie
function filtrerGalerieParCategorie(categorieSelectionnee) {
    console.log('➡️ Fonction filtrerGalerieParCategorie() appelée dans main.js pour la catégorie :', categorieSelectionnee); // ✅ LOG
    fetch(apiUrlWorks) // On refait une requête à l'API pour récupérer TOUTES les œuvres (on pourrait optimiser ça plus tard)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP lors du filtrage par catégorie dans main.js: ${response.status}`); // ✅ LOG erreur HTTP filtrage
            }
            return response.json();
        })
        .then(works => {
            let œuvresFiltrees; // Déclare une variable pour stocker les œuvres filtrées

            if (categorieSelectionnee === "Tous") {
                // Si catégorie "Tous" est sélectionnée, on affiche TOUTES les œuvres (pas de filtre)
                oeuvresFiltrees = works;
                console.log("🔍 Catégorie sélectionnée : Tous - Affichage de toutes les œuvres dans main.js."); // ✅ LOG catégorie "Tous"
            } else {
                // Sinon, on filtre les œuvres pour ne garder que celles de la catégorie sélectionnée
                oeuvresFiltrees = works.filter(work => work.category.name === categorieSelectionnee);
                console.log(`🔍 Catégorie sélectionnée : ${categorieSelectionnee} - Œuvres filtrées dans main.js :`, œuvresFiltrees); // ✅ LOG catégorie spécifique + œuvres filtrées
            }

            afficherGalerie(oeuvresFiltrees); // ✅ APPELLE afficherGalerie() en lui donnant le TABLEAU DES ŒUVRES FILTRÉES (oeuvresFiltrees)
        })
        .catch(error => {
            console.error('❌ Erreur lors du filtrage de la galerie par catégorie dans main.js :', error); // ✅ LOG erreur JS filtrage
        });
}


document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOMContentLoaded dans main.js");

    console.log("⚡️ Début de la récupération initiale des œuvres et des catégories depuis l'API dans main.js..."); // ✅ LOG initial fetch
    fetch(apiUrlWorks)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP initiale dans main.js! statut: ${response.status}`); // ✅ LOG erreur HTTP initial
            }
            console.log("✅ Réponse de l'API reçue avec succès pour la récupération initiale des œuvres dans main.js."); // ✅ LOG succès fetch initial
            return response.json();
        })
        .then(works => {
            console.log('Données des œuvres récupérées de l\'API dans main.js:', works);

            // 1. Créer un Set pour stocker les noms de catégories uniques
            const categoriesSet = new Set();

            // 2. Parcourir le tableau 'works' et ajouter le nom de chaque catégorie au Set
            works.forEach(work => {
                categoriesSet.add(work.category.name); // ✅ On ajoute le NOM de la catégorie (work.category.name) au Set
            });

            // 3. Convertir le Set en un tableau pour pouvoir le manipuler plus facilement
            const categoriesArray = Array.from(categoriesSet);

            console.log('Liste des catégories uniques dans main.js:', categoriesArray); // Pour vérifier la liste des catégories uniques dans la console

            afficherMenuCategories(categoriesArray); // ✅ Appelle la fonction pour créer le menu de catégories

            console.log('Appel initial de afficherGalerie depuis main.js avec:', works); // ✅ AJOUTÉ POUR VÉRIFIER SI afficherGalerie EST BIEN APPELÉE
            afficherGalerie(works); // ✅ Appelle la fonction pour afficher la galerie (complète pour l'instant)
        })
        .catch(error => {
            console.error('❌ Erreur lors de la récupération initiale des œuvres depuis l\'API dans main.js:', error); // ✅ LOG erreur fetch initial
        });

    const btnModifier = document.getElementById("modifier-button"); // ✅ Assurez-vous que vous avez bien récupéré le bouton "Modifier"

    if (!btnModifier) {
        console.error("❌ Erreur : Bouton 'Modifier' introuvable dans main.js!");
        return;
    }

    // ✅✅✅ NOUVEAU : Vérification du token pour déterminer si c'est un admin
    const token = localStorage.getItem("token");

    if (token) {
        // ✅ Token trouvé : Utilisateur considéré comme ADMIN
        console.log("🔑 Token d'admin trouvé dans main.js. Affichage de la vue ADMIN.");
        btnModifier.style.display = "block"; // Afficher le bouton "Modifier" pour les admins (ou 'inline-block' selon votre CSS)
    } else {
        // ❌ Token non trouvé : Utilisateur considéré comme UTILISATEUR NORMAL
        console.log("👤 Aucun token d'admin trouvé dans main.js. Affichage de la vue UTILISATEUR.");
        btnModifier.style.display = "none"; // Cacher le bouton "Modifier" pour les utilisateurs normaux
    }


    console.log("✅ Fin du DOMContentLoaded dans main.js");
});