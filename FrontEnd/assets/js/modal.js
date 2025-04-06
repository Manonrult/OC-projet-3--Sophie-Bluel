/**
 * Fonction pour recharger la galerie principale en récupérant les œuvres depuis l'API et en les affichant.
 * Utilisée après la suppression ou l'ajout d'une image pour mettre à jour la galerie visible par l'utilisateur.
 */
async function reloadMainGallery() {
    try {
        const res = await fetch(apiUrlWorks);
        if (!res.ok) {
            throw new Error(`Erreur HTTP lors du rechargement de la galerie depuis modal.js: ${res.status}`);
        }
        const works = await res.json();
        afficherGalerie(works);
    } catch (err) {
        console.error("Erreur dans reloadMainGallery() depuis modal.js :", err);
    }
}

/**
 * Écouteur d'événement DOMContentLoaded pour exécuter le script une fois que le document HTML est complètement chargé.
 * Initialise les éléments de la modale, ajoute les écouteurs d'événements pour la gestion de la modale,
 * le chargement des images, la suppression, l'ajout et la validation du formulaire.
 */
document.addEventListener("DOMContentLoaded", async function () {

    /**
     * Sélectionne tous les éléments HTML nécessaires pour interagir avec la modale et le formulaire.
     * Ces éléments incluent les boutons, les divs de modale, les inputs de formulaire, etc.
     * Chaque variable stocke une référence à un élément spécifique du DOM pour une manipulation ultérieure.
     */
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
    const fileInput = document.getElementById("file-input");
    const btnAjouterPhoto = document.getElementById("btn-ajouter-photo");
    const previewContainer = document.querySelector(".modal-photo-upload");
    const photoTitle = document.getElementById("photo-title");
    const photoCategory = document.getElementById("photo-category");
    const btnValidate = document.getElementById("photo-validate");
    const formPhoto = document.getElementById("photo-form");
    const formErrorMessage = document.getElementById("form-error-message");

    /**
     * Vérifie si tous les éléments nécessaires ont été correctement sélectionnés.
     * Si un élément est manquant, une erreur est loguée dans la console et la fonction s'arrête.
     * Cela assure que le script ne tente pas de manipuler des éléments inexistants, évitant des erreurs.
     */
    if (!modal || !btnModifier || !btnCloseModal || !modalWrapper ||
        !modalGallery || !modalUpload || !btnOpenUpload || !btnBack ||
        !galleryGrid || !fileInput || !btnAjouterPhoto || !previewContainer ||
        !photoTitle || !photoCategory || !btnValidate || !formPhoto || !formErrorMessage) {
        console.error("Erreur dans modal.js : Un ou plusieurs éléments sont introuvables !");
        return;
    }

    /**
     * Initialise la gestion de la modale, incluant l'ouverture, la fermeture et le changement de vues (galerie/upload).
     * Ajoute des écouteurs d'événements aux boutons et à la modale elle-même pour gérer ces interactions utilisateur.
     */

    // Masquer la modale au démarrage
    modal.style.display = "none";

    // Ouvrir la modale au clic sur "Modifier"
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        loadGalleryImages();
    });

    // Fermer la modale au clic sur la croix
    btnCloseModal.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "none";
    });

    // Fermer la modale en cliquant en dehors
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
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
    });

    // Revenir à la Galerie Photo
    btnBack.addEventListener("click", function (e) {
        e.preventDefault();
        modalUpload.classList.add("hidden");
        modalGallery.classList.remove("hidden");
        btnBack.classList.add("hidden");
    });

    /**
     * Fonction asynchrone pour charger les images de la galerie dans la modale depuis l'API.
     * Vide d'abord le contenu actuel de la galerie, puis effectue une requête GET à l'API pour récupérer les images.
     * Pour chaque image récupérée, crée un élément HTML pour l'afficher dans la galerie modale,
     * incluant un bouton de suppression.
     */
    async function loadGalleryImages() {
        galleryGrid.innerHTML = "";

        try {
            const response = await fetch("http://localhost:5678/api/works");
            if (!response.ok) throw new Error("Erreur lors du chargement des images de la modale depuis modal.js.");
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
                deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
                deleteBtn.addEventListener("click", () => deleteImage(image.id, projectDiv));

                projectDiv.appendChild(img);
                projectDiv.appendChild(deleteBtn);
                galleryGrid.appendChild(projectDiv);
            });

        } catch (error) {
            console.error("Erreur lors du chargement des images de la modale depuis modal.js:", error);
        }
    }

    /**
     * Fonction asynchrone pour supprimer une image de la galerie via l'API.
     * Récupère le token d'authentification depuis le stockage local, effectue une requête DELETE à l'API
     * pour supprimer l'image spécifiée par `imageId`.
     * En cas de succès, retire l'élément HTML correspondant à l'image de la galerie modale et recharge la galerie principale.
     */
    async function deleteImage(imageId, projectDiv) {

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Erreur dans modal.js : Token d'authentification introuvable ! Suppression impossible.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la suppression de l'image depuis modal.js. Status: ${response.status}. Détails: ${errorText}`);
            }
            projectDiv.remove();

            afficherMessage("🗑️ Image supprimée avec succès !");
            reloadMainGallery();


        } catch (error) {
            console.error("Erreur lors de la suppression de l'image depuis modal.js:", error);
        }
    }

    /**
     * Gestion de l'aperçu de l'image lors de l'ajout d'une photo.
     * L'écouteur sur `btnAjouterPhoto` simule un clic sur l'input de type fichier (`fileInput`).
     * L'écouteur sur `fileInput` lit le fichier sélectionné, crée un aperçu de l'image et l'affiche dans la zone dédiée.
     * Cache également les éléments initiaux de la zone d'upload (bouton "Ajouter photo" et icône) une fois une image sélectionnée.
     */
    btnAjouterPhoto.addEventListener("click", function (event) {
        event.preventDefault();
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById("btn-ajouter-photo").style.display = "none";
                document.getElementById("preview-icon").style.display = "none";

                const previewZone = document.getElementById("image-preview");
                previewZone.innerHTML = "";

                const imgPreview = document.createElement("img");
                imgPreview.src = event.target.result;
                imgPreview.alt = "Aperçu";
                imgPreview.classList.add("preview-img");

                previewZone.appendChild(imgPreview);
            };
            reader.readAsDataURL(file);
        }
        checkForm();
    });


    /**
     * Fonction pour vérifier la validité du formulaire d'ajout de photo.
     * Active ou désactive le bouton "Valider" en fonction de si tous les champs requis (titre, catégorie et image) sont remplis.
     * Affiche ou cache un message d'erreur si le formulaire est incomplet ou complet.
     */
    function checkForm() {
        const isFormValid = (photoTitle.value.trim() !== "" && photoCategory.value !== "" && fileInput.files.length > 0);
        btnValidate.style.color = "white";

        if (isFormValid) {
            btnValidate.removeAttribute("disabled");
            btnValidate.classList.add("enabled");
            btnValidate.style.backgroundColor = "";
            cacherErreurFormulaire();
        } else {
            btnValidate.setAttribute("disabled", "true");
            btnValidate.classList.remove("enabled");
            btnValidate.style.backgroundColor = "";
            afficherErreurFormulaire("⚠️ Veuillez remplir tous les champs pour valider.");
        }
    }

    photoTitle.addEventListener("input", checkForm);
    photoCategory.addEventListener("change", checkForm);
    fileInput.addEventListener("change", checkForm);

    /**
     * Gestion de la soumission du formulaire d'ajout de photo.
     * Empêche la soumission par défaut du formulaire, récupère le token d'authentification,
     * et envoie les données du formulaire (image, titre, catégorie) à l'API via une requête POST.
     * En cas de succès, ajoute la nouvelle image à la galerie modale, recharge la galerie principale,
     * réinitialise le formulaire et bascule vers la vue de la galerie.
     */
    formPhoto.addEventListener("submit", async function (e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Erreur dans modal.js : Aucun token trouvé, vous devez être connecté pour ajouter une image !");
            return;
        }

        if (fileInput.files.length === 0 || photoTitle.value.trim() === "" || photoCategory.value === "") {
            console.error("Formulaire incomplet...");
            setTimeout(function () {
                afficherErreurFormulaire("⚠️ Veuillez remplir tous les champs pour valider.");
            }, 50);
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
                const errorText = await response.text();
                throw new Error(`Erreur lors de l'ajout du projet depuis modal.js : ${response.status}. Détails: ${errorText}`);
            }

            const newWork = await response.json();

            afficherMessage("✅ Image ajoutée avec succès !");

            addImageToGallery(newWork);

            reloadMainGallery();

            modalUpload.classList.add("hidden");
            modalGallery.classList.remove("hidden");
            btnBack.classList.add("hidden");
            formPhoto.reset();
            fileInput.value = "";
            document.getElementById("image-preview").innerHTML = "";

            btnValidate.setAttribute("disabled", "true");
            btnValidate.classList.remove("enabled");
            btnValidate.style.backgroundColor = "";
            btnValidate.style.color = "white";

            btnAjouterPhoto.classList.remove("hidden");
            btnAjouterPhoto.style.display = "inline-block";

            const previewIcon = document.getElementById("preview-icon");
            if (previewIcon) previewIcon.style.display = "inline-block";

        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire depuis modal.js :", error);
        }

    });


    /**
     * Fonction pour ajouter visuellement une nouvelle image à la galerie modale.
     * Crée un nouvel élément HTML pour représenter l'image ajoutée, incluant l'image elle-même et le bouton de suppression.
     * Ajoute cet élément à la grille de la galerie modale.
     */
    function addImageToGallery(work) {

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

    }


    /**
     * Fonctions utilitaires pour afficher des messages de succès ou d'erreur à l'utilisateur.
     * `afficherMessage` affiche un message temporaire de succès.
     * `afficherErreurFormulaire` affiche un message d'erreur spécifique au formulaire, visible jusqu'à ce qu'il soit corrigé.
     */

    function afficherMessage(message) {
        const msgDiv = document.getElementById("modal-message");
        if (!msgDiv) {
            console.warn("Zone de message non trouvée ! (ID: modal-message)");
            return;
        }
        msgDiv.textContent = message;
        msgDiv.style.display = "block";

        setTimeout(() => {
            msgDiv.style.display = "none";
        }, 2500);
    }

    function afficherErreurFormulaire(message) {
        const msgDivErreur = document.getElementById("form-error-message");
        if (!msgDivErreur) {
            console.warn("Zone de message d'erreur de formulaire non trouvée ! (ID: form-error-message)");
            return;
        }
        msgDivErreur.textContent = message;
        msgDivErreur.style.display = "block";
    }

    /**
     * Fonction pour cacher le message d'erreur du formulaire.
     * Utilisée lorsque le formulaire devient valide après avoir été incomplet.
     */
    function cacherErreurFormulaire() {
        const msgDivErreur = document.getElementById("form-error-message");
        if (msgDivErreur) {
            msgDivErreur.style.display = "none";
        }
    }


});