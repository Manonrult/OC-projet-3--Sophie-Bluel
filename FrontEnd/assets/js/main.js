const apiUrlWorks = 'http://localhost:5678/api/works'; // Définition de l'URL de l'API pour récupérer les projets

function afficherGalerie(works) {
    // Fonction pour afficher la galerie de projets dans le DOM
    const galleryDiv = document.querySelector(".gallery"); // Sélectionne la div de la galerie
    galleryDiv.innerHTML = ''; // Vide le contenu actuel de la galerie

    works.forEach(work => {
        // Pour chaque projet...
        const figure = document.createElement("figure"); // Crée un élément figure
        const img = document.createElement("img"); // Crée un élément img
        img.src = work.imageUrl; // Définit la source de l'image
        img.alt = work.title; // Définit le texte alternatif de l'image

        const caption = document.createElement("figcaption"); // Crée un élément figcaption
        caption.textContent = work.title; // Définit le texte de la légende

        figure.appendChild(img); // Ajoute l'image à la figure
        figure.appendChild(caption); // Ajoute la légende à la figure
        galleryDiv.appendChild(figure); // Ajoute la figure à la galerie
    });
    console.log("Galerie affichée"); // Log pour confirmer l'affichage de la galerie
}

function afficherMenuCategories() {
    // Fonction pour afficher le menu des catégories de filtre
    const filtersDiv = document.querySelector(".filters"); // Sélectionne la div des filtres
    filtersDiv.innerHTML = ''; // Vide le contenu actuel des filtres

    const ordreMaquette = ["Tous", "Objets", "Appartements", "Hotels & restaurants"]; // Ordre d'affichage des catégories

    ordreMaquette.forEach(catName => {
        // Pour chaque nom de catégorie dans l'ordre défini...
        const btn = document.createElement("button"); // Crée un bouton
        btn.textContent = catName; // Définit le texte du bouton avec le nom de la catégorie
        btn.classList.add("filter-button"); // Ajoute la classe 'filter-button' au bouton

        btn.addEventListener("click", () => {
            // Ajoute un écouteur d'événement au clic sur le bouton
            filtrerGalerieParCategorie(catName); // Filtre la galerie par la catégorie sélectionnée
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active')); // Retire la classe 'active' de tous les boutons de filtre
            btn.classList.add('active'); // Ajoute la classe 'active' au bouton cliqué
        });

        filtersDiv.appendChild(btn); // Ajoute le bouton à la div des filtres
    });

    console.log("Filtres affichés !"); // Log pour confirmer l'affichage des filtres
}

function filtrerGalerieParCategorie(categorie) {
    // Fonction pour filtrer la galerie par catégorie
    fetch(apiUrlWorks) // Récupère les projets depuis l'API
        .then(res => res.json()) // Transforme la réponse en JSON
        .then(works => {
            let filtered = works; // Initialise les projets filtrés avec tous les projets
            if (categorie !== "Tous") {
                // Si la catégorie n'est pas "Tous"...
                filtered = works.filter(work => work.category.name === categorie); // Filtre les projets par catégorie
            }
            afficherGalerie(filtered); // Affiche la galerie filtrée
            console.log("Galerie filtrée par :", categorie); // Log pour indiquer la catégorie de filtrage
        })
        .catch(err => console.error("Erreur filtrage :", err)); // Gestion des erreurs lors du filtrage
}

document.addEventListener("DOMContentLoaded", () => {
    // Fonction exécutée lorsque le DOM est complètement chargé
    console.log("DOM Ready"); // Log pour indiquer que le DOM est prêt

    const token = localStorage.getItem("token"); // Récupère le token d'authentification depuis le stockage local
    const btnModifier = document.getElementById("modifier-button"); // Sélectionne le bouton "Modifier"
    const logoutBtn = document.getElementById("logout-button"); // Sélectionne le bouton "logout"
    const filtersDiv = document.querySelector(".filters"); // Sélectionne la div des filtres

    // Vérification de connexion admin ou utilisateur
    if (token) {
        // Si un token est présent (utilisateur admin connecté)...
        console.log("Admin connecté"); // Log pour indiquer une connexion admin
        if (btnModifier) btnModifier.style.display = "block"; // Affiche le bouton "Modifier"
        if (logoutBtn) logoutBtn.style.display = "block"; // Affiche le bouton "logout"

        logoutBtn.addEventListener("click", () => {
            // Ajoute un écouteur d'événement au clic sur le bouton "logout"
            localStorage.removeItem("token"); // Supprime le token du stockage local
            window.location.reload(); // Recharge la page
        });

        if (filtersDiv) {
            filtersDiv.style.display = "none"; // Cache la div des filtres pour l'admin
            console.log("Filtres masqués pour admin"); // Log pour indiquer que les filtres sont masqués pour l'admin
        }
    } else {
        // Si aucun token n'est présent (utilisateur normal non connecté)...
        console.log("Utilisateur normal"); // Log pour indiquer un utilisateur normal
        if (btnModifier) btnModifier.style.display = "none"; // Cache le bouton "Modifier"
        if (logoutBtn) logoutBtn.style.display = "none"; // Cache le bouton "logout"
        if (filtersDiv) {
            filtersDiv.style.display = "flex"; // Affiche la div des filtres pour l'utilisateur normal
            console.log("Filtres visibles pour utilisateur"); // Log pour indiquer que les filtres sont visibles pour l'utilisateur
        }
    }

    // Appel API pour récupérer et afficher les projets
    fetch(apiUrlWorks) // Récupère les projets depuis l'API
        .then(res => res.json()) // Transforme la réponse en JSON
        .then(works => {
            afficherGalerie(works); // Affiche la galerie avec les projets récupérés

            // Gestion des catégories uniques pour le menu de filtre
            const categories = [...new Set(works.map(w => w.category.name))]; // Extrait les noms de catégories uniques des projets
            if (!token) afficherMenuCategories(); // Affiche le menu des catégories seulement si l'utilisateur n'est pas admin
        })
        .catch(err => console.error("Erreur API :", err)); // Gestion des erreurs lors de l'appel API
});