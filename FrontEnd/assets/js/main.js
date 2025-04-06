const apiUrlWorks = 'http://localhost:5678/api/works';

/**
 * Fonction pour afficher la galerie d'œuvres sur la page web.
 * Elle prend un tableau d'objets 'works' en entrée et les affiche dans la section galerie.
 */
function afficherGalerie(works) {
    const galleryDiv = document.querySelector(".gallery");
    galleryDiv.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        galleryDiv.appendChild(figure);
    });
}

/**
 * Fonction pour afficher le menu des catégories de filtres.
 * Elle crée des boutons de filtre pour chaque catégorie et les ajoute à la section des filtres.
 */
function afficherMenuCategories() {
    const filtersDiv = document.querySelector(".filters");
    filtersDiv.innerHTML = '';

    const ordreMaquette = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];

    ordreMaquette.forEach(catName => {
        const btn = document.createElement("button");
        btn.textContent = catName;
        btn.classList.add("filter-button");

        btn.addEventListener("click", () => {
            filtrerGalerieParCategorie(catName);
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });

        filtersDiv.appendChild(btn);
    });
}

/**
 * Fonction pour filtrer la galerie par catégorie sélectionnée.
 * Elle récupère les œuvres depuis l'API et filtre celles correspondant à la catégorie choisie avant de les afficher.
 */
function filtrerGalerieParCategorie(categorie) {
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            let filtered = works;
            if (categorie !== "Tous") {
                filtered = works.filter(work => work.category.name === categorie);
            }
            afficherGalerie(filtered);
        })
        .catch(err => console.error("Erreur filtrage :", err));
}

/**
 * Écouteur d'événement DOMContentLoaded pour exécuter le code après le chargement complet du DOM.
 * Gère l'affichage de l'interface admin/utilisateur et l'affichage initial de la galerie.
 */
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const btnModifier = document.getElementById("modifier-button");
    const filtersDiv = document.querySelector(".filters");
    const loginLink = document.querySelector(".nav-login");

    /**
     * Gestion de l'affichage des éléments de la page en fonction du rôle de l'utilisateur (admin ou non).
     * Affiche ou masque le bouton "Modifier" et la section des filtres selon que l'utilisateur est admin ou non.
     * Modifie également le lien de connexion/déconnexion dans la navigation.
     * Exemple de concaténation dans ce bloc : modification de loginLink.href avec '#' (bien que simple).
     */
    if (token && isAdmin) {
        if (btnModifier) btnModifier.style.display = "block";
        if (filtersDiv) filtersDiv.style.display = "none";

        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#"; // Exemple simple de concaténation :  '#' est concaténé à l'URL actuelle (qui est vide ici car '#' ne change pas l'URL).
            loginLink.style.fontWeight = "bold";

            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.reload();
            });
        }
    } else {
        if (btnModifier) btnModifier.style.display = "none";
        if (filtersDiv) filtersDiv.style.display = "flex";
    }

    /**
     * Appel à l'API pour récupérer et afficher les projets dans la galerie.
     * Récupère les données depuis l'API_WORKS et appelle afficherGalerie pour les afficher.
     * Si l'utilisateur n'est pas admin, affiche également le menu des catégories.
     */
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            afficherGalerie(works);

            if (!token || !isAdmin) {
                afficherMenuCategories();
            }
        })
        .catch(err => console.error("Erreur API :", err));
});