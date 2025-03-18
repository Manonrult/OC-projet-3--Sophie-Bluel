document.addEventListener("DOMContentLoaded", function () {
    console.log("modal.js chargé !");

    // Récupérer les éléments
    const modal = document.getElementById("modal1"); // Sélectionne la modale
    const btnModifier = document.getElementById("modifier-button"); // Bouton Modifier
    const btnCloseModal = document.querySelector(".modal-close"); // Bouton de fermeture

    // Vérification des éléments
    if (!modal) {
        console.error("❌ Erreur : L'élément #modal1 est introuvable dans le DOM !");
        return;
    }
    if (!btnModifier) {
        console.error("❌ Erreur : L'élément #modifier-button est introuvable dans le DOM !");
        return;
    }
    if (!btnCloseModal) {
        console.warn("⚠️ Attention : L'élément .modal-close est introuvable dans le DOM !");
    }

    console.log("✅ Tous les éléments nécessaires sont trouvés.");

    // Assurer que la modale est bien cachée au chargement
    modal.style.display = "none";

    // 🔹 Afficher la modale au clic sur "modifier"
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        console.log("✅ Modale ouverte !");
    });

    // 🔹 Fermer la modale au clic sur la croix
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", function () {
            modal.style.display = "none";
            console.log("✅ Modale fermée (croix) !");
        });
    }
});
