// modal.js

// ✅ NOUVELLE FONCTION : reloadMainGallery pour recharger et réafficher la galerie principale (MAINTENANT DANS main.js MAIS APPELÉE D'ICI)
async function reloadMainGallery() {
    console.log("🔄 Démarrage de reloadMainGallery() dans modal.js pour recharger la galerie principale..."); // ✅ LOG
    try {
        const res = await fetch(apiUrlWorks); // Récupère les œuvres depuis l'API (apiUrlWorks est définie dans main.js, il faut s'assurer que main.js est inclus AVANT modal.js dans le HTML)
        if (!res.ok) {
            throw new Error(`Erreur HTTP lors du rechargement de la galerie depuis modal.js: ${res.status}`); // ✅ LOG erreur HTTP
        }
        const works = await res.json();
        afficherGalerie(works); // Réaffiche la galerie principale avec les nouvelles données (afficherGalerie est définie dans main.js, doit être globale ou importée)
        console.log("🔄 Galerie principale rechargée avec succès depuis modal.js !"); // ✅ LOG succès
    } catch (err) {
        console.error("❌ Erreur dans reloadMainGallery() depuis modal.js :", err); // ✅ LOG erreur JS
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ modal.js chargé !");

    // =========================
    // 1️⃣ Sélection des éléments
    // =========================
    const modal = document.getElementById("modal1");
    const btnModifier = document.getElementById("modifier-button");
    const btnCloseModal = document.getElementById("modal-close");
    const modalWrapper = document.querySelector('.modal-wrapper');
    const modalGallery = document.getElementById("modal-gallery");
    const modalUpload = document.getElementById("modal-upload");
    const btnOpenUpload = document.getElementById("btn-open-upload");
    const btnBack = document.getElementById("modal-back");
    const galleryGrid = document.querySelector(".gallery-grid");

    // Éléments pour l'ajout de photo
    const fileInput = document.getElementById("file-input");         // <input type="file">
    const btnAjouterPhoto = document.getElementById("btn-ajouter-photo"); // Lien "+ Ajouter photo"
    const previewContainer = document.querySelector(".modal-photo-upload");
    const photoTitle = document.getElementById("photo-title");
    const photoCategory = document.getElementById("photo-category");
    const btnValidate = document.getElementById("photo-validate");
    const formPhoto = document.getElementById("photo-form");         // <form id="photo-form">

    // Vérification
    if (!modal || !btnModifier || !btnCloseModal || !modalWrapper ||
        !modalGallery || !modalUpload || !btnOpenUpload || !btnBack ||
        !galleryGrid || !fileInput || !btnAjouterPhoto || !previewContainer ||
        !photoTitle || !photoCategory || !btnValidate || !formPhoto) {
        console.error("❌ Erreur dans modal.js : Un ou plusieurs éléments sont introuvables !");
        return;
    }
    console.log("✅ Tous les éléments nécessaires trouvés dans modal.js.");

    // =========================
    // 2️⃣ Gestion de la modale
    // =========================

    // Masquer la modale au démarrage
    modal.style.display = "none";

    // Ouvrir la modale au clic sur "Modifier"
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        console.log("✅ Modale ouverte depuis modal.js !");
        loadGalleryImages(); // Charger les images à chaque ouverture
    });

    // Fermer la modale au clic sur la croix
    btnCloseModal.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "none";
        console.log("✅ Modale fermée (croix) depuis modal.js !");
    });

    // Fermer la modale en cliquant en dehors
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            console.log("✅ Modale fermée (clic dehors) depuis modal.js !");
        }
    });

    // Empêcher la fermeture en cliquant dans la modale
    modalWrapper.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Passer à la vue "Ajout Photo"
    btnOpenUpload.addEventListener("click", function (e) {
        e.preventDefault();
        modalGallery.classList.add("hidden");
        modalUpload.classList.remove("hidden");
        btnBack.classList.remove("hidden");
        console.log("📂 Passage à la vue Ajout Photo depuis modal.js");
    });

    // Revenir à la Galerie Photo
    btnBack.addEventListener("click", function (e) {
        e.preventDefault();
        modalUpload.classList.add("hidden");
        modalGallery.classList.remove("hidden");
        btnBack.classList.add("hidden");
        console.log("📷 Retour à la Galerie Photo depuis modal.js");
    });

    // =========================
    // 3️⃣ Chargement des images (GET) - POUR LA MODALE UNIQUEMENT
    // =========================
    async function loadGalleryImages() {
        console.log("🔄 Chargement des images de la modale depuis modal.js..."); // ✅ LOG
        galleryGrid.innerHTML = ""; // Réinitialisation avant le chargement

        try {
            const response = await fetch("http://localhost:5678/api/works");
            if (!response.ok) throw new Error("Erreur lors du chargement des images de la modale depuis modal.js."); // ✅ LOG erreur fetch modale
            const images = await response.json();

            images.forEach(image => {
                const projectDiv = document.createElement("div");
                projectDiv.classList.add("modal-project");

                const img = document.createElement("img");
                img.src = image.imageUrl;
                img.alt = image.title;
                img.classList.add("modal-project-image");

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("btn-delete");
                // Icône FontAwesome
                deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
                deleteBtn.addEventListener("click", () => deleteImage(image.id, projectDiv));

                projectDiv.appendChild(img);
                projectDiv.appendChild(deleteBtn);
                galleryGrid.appendChild(projectDiv);
            });

            console.log("✅ Images de la modale chargées avec succès depuis modal.js."); // ✅ LOG succès fetch modale
        } catch (error) {
            console.error("❌ Erreur lors du chargement des images de la modale depuis modal.js:", error); // ✅ LOG erreur JS modale
        }
    }

    // =========================
    // 4️⃣ Suppression d'une image (DELETE) - MODIFIÉ POUR APPELER reloadMainGallery()
    // =========================
    async function deleteImage(imageId, projectDiv) {
        console.log(`🗑 Tentative de suppression de l'image ID: ${imageId} depuis modal.js`); // ✅ LOG suppression start

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Erreur dans modal.js : Token d'authentification introuvable ! Suppression impossible."); // ✅ LOG token manquant
            return;
        }

        try {
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la suppression de l'image depuis modal.js. Status: ${response.status}. Détails: ${errorText}`); // ✅ LOG erreur fetch delete
            }

            console.log(`✅ Image ID ${imageId} supprimée avec succès du serveur (status 204) depuis modal.js.`); // ✅ LOG suppression serveur OK
            projectDiv.remove(); // Supprime l'élément du DOM
            console.log("✅ Image supprimée de la modale depuis modal.js."); // ✅ LOG suppression modale OK

            reloadMainGallery(); // ✅✅✅  RECHARGE LA GALERIE PRINCIPALE APRÈS SUPPRESSION ! ✅✅✅

        } catch (error) {
            console.error("❌ Erreur lors de la suppression de l'image depuis modal.js:", error); // ✅ LOG erreur JS delete
        }
    }

    // =========================
    // 5️⃣ Aperçu de l'image dans la vue "Ajout Photo"
    // =========================
    btnAjouterPhoto.addEventListener("click", function (event) {
        event.preventDefault();
        fileInput.click(); // Ouvre la boîte de sélection de fichiers
    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            console.log(" Image sélectionnée :", file.name);

            // Vérifier le type de fichier
            if (!file.type.startsWith("image/")) {
                console.error("❌ Fichier non valide dans modal.js ! Seules les images sont acceptées."); // ✅ LOG fichier invalide
                previewContainer.innerHTML = "<p>Fichier non valide. Veuillez sélectionner une image (jpg, png).</p>"; // Message visuel dans la preview
                return;
            }

            // Créer l'aperçu
            const reader = new FileReader();
            reader.onload = function (event) {
                // Vider l'ancien contenu
                previewContainer.innerHTML = "";
                const imgPreview = document.createElement("img");
                imgPreview.src = event.target.result;
                imgPreview.style.width = "129px";
                imgPreview.style.height = "193px";
                imgPreview.style.objectFit = "cover";
                imgPreview.style.borderRadius = "5px";

                previewContainer.appendChild(imgPreview);
                console.log(" Aperçu mis à jour dans modal.js !");
            };

            reader.readAsDataURL(file);
        }
        checkForm(); // Vérifie si tout est rempli
    });

    // =========================
    // 6️⃣ Activation du bouton "Valider" selon les champs
    // =========================
    function checkForm() {
        console.log("🧐 Vérification du formulaire dans modal.js..."); // ✅ LOG checkForm start
        const isFormValid = (photoTitle.value.trim() !== "" && photoCategory.value !== "" && fileInput.files.length > 0);
        if (isFormValid) {
            btnValidate.removeAttribute("disabled");
            btnValidate.style.background = "rgba(29, 97, 84, 1)";
            console.log("✅ Formulaire complet, bouton Valider activé dans modal.js!"); // ✅ LOG form valid
        } else {
            btnValidate.setAttribute("disabled", "true");
            btnValidate.style.background = "gray";
            console.log(" Formulaire incomplet, bouton Valider désactivé dans modal.js!"); // ✅ LOG form invalid
        }
    }

    photoTitle.addEventListener("input", checkForm);
    photoCategory.addEventListener("change", checkForm);
    fileInput.addEventListener("change", checkForm);

    // =========================
    // 7️⃣ Envoi du formulaire (POST) - MODIFIÉ POUR APPELER reloadMainGallery()
    // =========================
    formPhoto.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("🚀 Soumission du formulaire depuis modal.js..."); // ✅ LOG submit form start

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Erreur dans modal.js : Aucun token trouvé, vous devez être connecté pour ajouter une image !"); // ✅ LOG token manquant submit
            return;
        }

        if (fileInput.files.length === 0 || photoTitle.value.trim() === "" || photoCategory.value === "") {
            console.error("❌ Formulaire d'ajout d'image incomplet dans modal.js. Veuillez remplir tous les champs et sélectionner une image."); // ✅ LOG formulaire incomplet submit
            alert("⚠️ Formulaire incomplet. Veuillez remplir tous les champs et sélectionner une image."); // ⚠️ Message ALERTE visible à l'utilisateur
            return; // 🛑 Arrête la soumission si formulaire incomplet
        }

        // Construction de FormData
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        formData.append("title", photoTitle.value.trim());
        formData.append("category", photoCategory.value);

        console.log("📤 Envoi des données du formulaire à l'API depuis modal.js...", formData); // ✅ LOG formData

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de l'ajout du projet depuis modal.js : ${response.status}. Détails: ${errorText}`); // ✅ LOG erreur fetch post
            }

            const newWork = await response.json();
            console.log("✅ Projet ajouté avec succès côté serveur depuis modal.js :", newWork); // ✅ LOG succès post

            // Ajouter immédiatement la nouvelle image dans la galerie modale
            addImageToGallery(newWork);

            reloadMainGallery(); // ✅✅✅  RECHARGE LA GALERIE PRINCIPALE APRÈS AJOUT ! ✅✅✅

            // Revenir à la galerie + réinitialiser le formulaire
            modalUpload.classList.add("hidden");
            modalGallery.classList.remove("hidden");
            btnBack.classList.add("hidden");
            formPhoto.reset();
            fileInput.value = "";
            previewContainer.innerHTML = "";
            btnValidate.setAttribute("disabled", "true");
            btnValidate.style.background = "gray";
            console.log("✅ Formulaire réinitialisé et modale revenue à la galerie depuis modal.js."); // ✅ LOG reset form + modal view

        } catch (error) {
            console.error("❌ Erreur lors de la requête d'ajout d'image depuis modal.js :", error); // ✅ LOG erreur JS post
        }
    });

    // =========================
    // 8️⃣ Fonction pour ajouter la nouvelle image dans la galerie modale (INCHANGÉE)
    // =========================
    function addImageToGallery(work) {
        console.log("🖼 Ajout de l'image dans la galerie modale depuis modal.js:", work.title); // ✅ LOG addImageToModal start

        const projectDiv = document.createElement("div");
        projectDiv.classList.add("modal-project");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        img.classList.add("modal-project-image");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn-delete");
        deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        deleteBtn.addEventListener("click", () => deleteImage(work.id, projectDiv));

        projectDiv.appendChild(img);
        projectDiv.appendChild(deleteBtn);
        galleryGrid.appendChild(projectDiv);

        console.log("✅ Nouvelle image ajoutée visuellement à la galerie modale depuis modal.js."); // ✅ LOG addImageToModal end
    }

    console.log("✅ Tout est prêt dans modal.js !");
});