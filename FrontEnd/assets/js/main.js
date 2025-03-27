const apiUrlWorks = 'http://localhost:5678/api/works';

// === AFFICHAGE GALERIE ===
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

    console.log("Galerie affichée");
}

// === AFFICHAGE DES FILTRES ===
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

    console.log("Filtres affichés !");
}

// === FILTRAGE DES PROJETS PAR CATÉGORIE ===
function filtrerGalerieParCategorie(categorie) {
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            let filtered = works;
            if (categorie !== "Tous") {
                filtered = works.filter(work => work.category.name === categorie);
            }
            afficherGalerie(filtered);
            console.log("Galerie filtrée par :", categorie);
        })
        .catch(err => console.error("Erreur filtrage :", err));
}

// === GESTION ADMIN & GALERIE ===
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Ready");

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const btnModifier = document.getElementById("modifier-button");
    const filtersDiv = document.querySelector(".filters");
    const loginLink = document.querySelector(".nav-login");

    // Gestion des éléments selon le rôle
    if (token && isAdmin) {
        console.log("Admin connecté");
        if (btnModifier) btnModifier.style.display = "block";
        if (filtersDiv) filtersDiv.style.display = "none";

        // Remplacer "login" par "Logout"
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.style.fontWeight = "bold";

            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.reload();
            });
        }
    } else {
        console.log("Utilisateur normal");
        if (btnModifier) btnModifier.style.display = "none";
        if (filtersDiv) filtersDiv.style.display = "flex";
    }

    // Appel de l’API pour afficher les projets
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            afficherGalerie(works);

            // Affiche les filtres uniquement si l’utilisateur n’est pas admin
            if (!token || !isAdmin) {
                afficherMenuCategories();
            }
        })
        .catch(err => console.error("Erreur API :", err));
});
