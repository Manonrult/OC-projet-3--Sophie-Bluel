// URL de l'API pour récupérer les œuvres (route GET /works de ton backend)
const apiUrlWorks = 'http://localhost:5678/api/works'; // ⚠️ VERIFIEZ ET ADAPTEZ LE PORT SI NECESSAIRE !

fetch(apiUrlWorks)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        return response.json();
    })
    .then(works => {
        console.log('Données des œuvres récupérées de l\'API:', works);

        // 1. Créer un Set pour stocker les noms de catégories uniques
        const categoriesSet = new Set();

        // 2. Parcourir le tableau 'works' et ajouter le nom de chaque catégorie au Set
        works.forEach(work => {
            categoriesSet.add(work.category.name); // ✅ On ajoute le NOM de la catégorie (work.category.name) au Set
        });

        // 3. Convertir le Set en un tableau pour pouvoir le manipuler plus facilement
        const categoriesArray = Array.from(categoriesSet);

        console.log('Liste des catégories uniques:', categoriesArray); // Pour vérifier la liste des catégories uniques dans la console

        afficherMenuCategories(categoriesArray); // ✅ Appelle la fonction pour créer le menu de catégories

        console.log('Appel de afficherGalerie avec:', works); // ✅ AJOUTÉ POUR VÉRIFIER SI afficherGalerie EST BIEN APPELÉE
        afficherGalerie(works); // ✅ Appelle la fonction pour afficher la galerie (complète pour l'instant)
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des œuvres depuis l\'API:', error);
    });

// ➡️  Fonction pour créer et afficher le menu de catégories
function afficherMenuCategories(categories) {
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
}

// ➡️  Fonction pour FILTRER la galerie par catégorie (CODE MODIFIÉ POUR LE FILTRAGE !)
function filtrerGalerieParCategorie(categorieSelectionnee) {
    console.log('Filtrage par catégorie :', categorieSelectionnee);

    fetch(apiUrlWorks) // On refait une requête à l'API pour récupérer TOUTES les œuvres (on pourrait optimiser ça plus tard)
        .then(response => response.json())
        .then(works => {
            let œuvresFiltrees; // Déclare une variable pour stocker les œuvres filtrées

            if (categorieSelectionnee === "Tous") {
                // Si catégorie "Tous" est sélectionnée, on affiche TOUTES les œuvres (pas de filtre)
                oeuvresFiltrees = works;
            } else {
                // Sinon, on filtre les œuvres pour ne garder que celles de la catégorie sélectionnée
                oeuvresFiltrees = works.filter(work => work.category.name === categorieSelectionnee);
            }

            console.log('Œuvres filtrées pour la catégorie', categorieSelectionnee + ':', œuvresFiltrees); // Pour vérifier les œuvres filtrées dans la console

            afficherGalerie(oeuvresFiltrees); // ✅ APPELLE afficherGalerie() en lui donnant le TABLEAU DES ŒUVRES FILTRÉES (oeuvresFiltrees)
        });
}

// ➡️  Fonction pour afficher les œuvres dans la galerie
function afficherGalerie(works) {
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
}