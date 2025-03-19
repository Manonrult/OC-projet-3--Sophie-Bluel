document.addEventListener("DOMContentLoaded", function () {
    console.log("modal.js chargé !");

    // --- Récupération des éléments HTML ---
    const modal = document.getElementById("modal1");
    const btnModifier = document.getElementById("modifier-button");
    const btnCloseModal = document.querySelector("#modal-close");
    const modalWrapper = document.querySelector('.modal-wrapper');

    // --- Vérification de la présence des éléments ---
    if (!modal) { console.error("❌ Erreur : #modal1 introuvable !"); return; }
    if (!btnModifier) { console.error("❌ Erreur : #modifier-button introuvable !"); return; }
    if (!btnCloseModal) { console.warn("⚠️ Attention : #modal-close introuvable !"); }
    if (!modalWrapper) { console.error("❌ Erreur : .modal-wrapper introuvable !"); return; }

    console.log("✅ Éléments nécessaires trouvés.");

    // --- Modale cachée au démarrage ---
    modal.style.display = "none";

    // --- Ouvrir la modale au clic sur "modifier" ---
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        modal.style.display = "block"; // Affiche la modale
        console.log("✅ Modale ouverte !");
    });

    // --- Fermer la modale au clic sur la croix ---
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            modal.style.display = "none"; // Cache la modale
            console.log("✅ Modale fermée (croix) !");
        });
    }

    // --- Fermer la modale en cliquant EN DEHORS (sur l'overlay) ---
    modal.addEventListener('click', function (event) {
        console.log("Clic détecté sur overlay"); // Log pour test
        console.log("event.target:", event.target); // Log pour test
        console.log("modal:", modal); // Log pour test

        if (event.target === modal) { // Si l'élément cliqué est L'OVERLAY LUI-MÊME
            modal.style.display = "none"; // Cache la modale
            console.log("✅ Modale fermée (clic dehors) !");
        } else {
            console.log("❌ Clic PAS sur overlay"); // Log pour test
        }
    });

    // --- Empêcher la fermeture en cliquant DANS la modale ---
    modalWrapper.addEventListener('click', function (event) {
        event.stopPropagation(); // Empêche le clic de se propager à l'overlay et de fermer la modale
    });

});