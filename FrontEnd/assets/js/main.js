const apiUrlWorks = 'http://localhost:5678/api/works';

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
    console.log("✅ Galerie affichée");
}

function afficherMenuCategories(categories) {
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

    console.log("✅ Filtres affichés !");
}

function filtrerGalerieParCategorie(categorie) {
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            let filtered = works;
            if (categorie !== "Tous") {
                filtered = works.filter(work => work.category.name === categorie);
            }
            afficherGalerie(filtered);
            console.log("🎯 Galerie filtrée par :", categorie);
        })
        .catch(err => console.error("❌ Erreur filtrage :", err));
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM Ready");

    const token = localStorage.getItem("token");
    const btnModifier = document.getElementById("modifier-button");
    const logoutBtn = document.getElementById("logout-button");
    const filtersDiv = document.querySelector(".filters");

    // Connexion admin ou utilisateur
    if (token) {
        console.log("🔐 Admin connecté");
        if (btnModifier) btnModifier.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "block";

        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });

        if (filtersDiv) {
            filtersDiv.style.display = "none";
            console.log("🚫 Filtres masqués pour admin");
        }
    } else {
        console.log("👤 Utilisateur normal");
        if (btnModifier) btnModifier.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (filtersDiv) {
            filtersDiv.style.display = "flex";
            console.log("✅ Filtres visibles pour utilisateur");
        }
    }

    // Appel API
    fetch(apiUrlWorks)
        .then(res => res.json())
        .then(works => {
            afficherGalerie(works);

            // Catégories uniques
            const categories = [...new Set(works.map(w => w.category.name))];
            if (!token) afficherMenuCategories(categories);
        })
        .catch(err => console.error("❌ Erreur API :", err));
});
