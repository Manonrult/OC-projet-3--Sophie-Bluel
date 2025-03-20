document.addEventListener("DOMContentLoaded", async function () {
    console.log("modal.js chargé !");

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
        console.error("❌ Erreur : Un ou plusieurs éléments sont introuvables !");
        return;
    }
    console.log("✅ Tous les éléments nécessaires trouvés.");

    // =========================
    // 2️⃣ Gestion de la modale
    // =========================

    // Masquer la modale au démarrage
    modal.style.display = "none";

    // Ouvrir la modale au clic sur "Modifier"
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        console.log("✅ Modale ouverte !");
        loadGalleryImages(); // Charger les images à chaque ouverture
    });

    // Fermer la modale au clic sur la croix
    btnCloseModal.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "none";
        console.log("✅ Modale fermée (croix) !");
    });

    // Fermer la modale en cliquant en dehors
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            console.log("✅ Modale fermée (clic dehors) !");
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
        console.log("📂 Passage à la vue Ajout Photo");
    });

    // Revenir à la Galerie Photo
    btnBack.addEventListener("click", function (e) {
        e.preventDefault();
        modalUpload.classList.add("hidden");
        modalGallery.classList.remove("hidden");
        btnBack.classList.add("hidden");
        console.log("📷 Retour à la Galerie Photo");
    });

    // =========================
    // 3️⃣ Chargement des images (GET)
    // =========================
    async function loadGalleryImages() {
        console.log("🔄 Chargement des images...");
        galleryGrid.innerHTML = ""; // Réinitialisation avant le chargement

        try {
            const response = await fetch("http://localhost:5678/api/works");
            if (!response.ok) throw new Error("Erreur lors du chargement des images.");
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

            console.log("✅ Images chargées dans la galerie.");
        } catch (error) {
            console.error("❌ Erreur :", error);
        }
    }

    // =========================
    // 4️⃣ Suppression d'une image (DELETE)
    // =========================
    async function deleteImage(imageId, projectDiv) {
        console.log(`🗑 Tentative de suppression de l'image ID: ${imageId}`);

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Erreur : Token d'authentification introuvable !");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression.");

            console.log(`✅ Image ID ${imageId} supprimée avec succès !`);
            projectDiv.remove(); // Supprime l'élément du DOM
        } catch (error) {
            console.error("❌ Erreur :", error);
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
                console.error(" Fichier non valide !");
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
                console.log(" Aperçu mis à jour !");
            };

            reader.readAsDataURL(file);
        }
        checkForm(); // Vérifie si tout est rempli
    });

    // =========================
    // 6️⃣ Activation du bouton "Valider" selon les champs
    // =========================
    function checkForm() {
        console.log("🧐 Vérification du formulaire...");
        if (photoTitle.value.trim() !== "" && photoCategory.value !== "" && fileInput.files.length > 0) {
            btnValidate.removeAttribute("disabled");
            btnValidate.style.background = "rgba(29, 97, 84, 1)";
            console.log("✅ Formulaire complet, bouton activé !");
        } else {
            btnValidate.setAttribute("disabled", "true");
            btnValidate.style.background = "gray";
            console.log(" Formulaire incomplet, bouton désactivé !");
        }
    }

    photoTitle.addEventListener("input", checkForm);
    photoCategory.addEventListener("change", checkForm);
    fileInput.addEventListener("change", checkForm);

    // =========================
    // 7️⃣ Envoi du formulaire (POST)
    // =========================
    formPhoto.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("🚀 Soumission du formulaire...");

        const token = localStorage.getItem("token");
        if (!token) {
            console.error(" Erreur : Aucun token trouvé, vous devez être connecté !");
            return;
        }

        if (fileInput.files.length === 0 || photoTitle.value.trim() === "" || photoCategory.value === "") {
            console.error(" Formulaire incomplet, impossible d'envoyer.");
            return;
        }

        // Construction de FormData
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        formData.append("title", photoTitle.value.trim());
        formData.append("category", photoCategory.value);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de l'ajout du projet : ${response.status}`);
            }

            const newWork = await response.json();
            console.log("✅ Projet ajouté avec succès :", newWork);

            // Ajouter immédiatement la nouvelle image dans la galerie
            addImageToGallery(newWork);

            // Revenir à la galerie + réinitialiser le formulaire
            modalUpload.classList.add("hidden");
            modalGallery.classList.remove("hidden");
            btnBack.classList.add("hidden");
            formPhoto.reset();
            fileInput.value = "";
            previewContainer.innerHTML = "";
            btnValidate.setAttribute("disabled", "true");
            btnValidate.style.background = "gray";

        } catch (error) {
            console.error("❌ Erreur lors de la requête :", error);
        }
    });

    // =========================
    // 8️⃣ Fonction pour ajouter la nouvelle image dans la galerie
    // =========================
    function addImageToGallery(work) {
        console.log("🖼 Ajout dans la galerie :", work.title);

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

        console.log("✅ Nouvelle image ajoutée dans la galerie !");
    }

    console.log("✅ Tout est prêt dans modal.js !");
});
