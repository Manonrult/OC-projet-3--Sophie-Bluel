// modal.js
document.addEventListener("DOMContentLoaded", function () {
    const btnModifier = document.getElementById("modifier-button");

    if (!btnModifier) {
        console.error("❌ Erreur : L'élément #modifier-button est introuvable dans le DOM !");
        return;
    }

    console.log("✅ Bouton Modifier trouvé :", btnModifier);

    btnModifier.addEventListener("click", function () {
        console.log("🔹 Clic détecté sur 'modifier-button' !");
        const modal = document.getElementById("modal1");
        modal.style.display = "block";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal1"); // Sélectionne la modale
    const openModalBtn = document.getElementById("modifier-button"); // Bouton Modifier
    const closeModalBtn = document.querySelector(".modal-close"); // Bouton de fermeture
    const modalOverlay = document.querySelector(".modal-overlay"); // Fond noir de la modale

    // 🔹 Assurer que la modale est bien cachée au chargement
    if (modal) {
        modal.style.display = "none";
    }

    // 🔹 Afficher la modale au clic sur le bouton Modifier
    if (openModalBtn) {
        openModalBtn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "block";
        });
    }

    // 🔹 Fermer la modale au clic sur la croix
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    // 🔹 Fermer la modale en cliquant sur le fond noir
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }
});

console.log("modal.js chargé !"); // AJOUTE CE CONSOLE.LOG - TEST INITIAL

const modal = document.getElementById("modal1");
console.log("modal:", modal); // AJOUTE CE CONSOLE.LOG - VÉRIFIER SI modal EST NULL OU PAS

if (modal) { // AJOUTE CE IF - VÉRIFIER SI modal EXISTE AVANT D'AJOUTER L'ÉCOUTEUR D'ÉVÉNEMENT
    const btnModifier = document.getElementById("modifier-button");
    console.log("btnModifier:", btnModifier); // AJOUTE CE CONSOLE.LOG - VÉRIFIER SI btnModifier EST NULL OU PAS

    if (btnModifier) { // AJOUTE CE IF - VÉRIFIER SI btnModifier EXISTE AVANT D'AJOUTER L'ÉCOUTEUR D'ÉVÉNEMENT
        btnModifier.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "block";
            console.log("Modale ouverte !"); // AJOUTE CE CONSOLE.LOG - TEST OUVERTURE MODALE
        });
    } else {
        console.error("Erreur : btnModifier est null ! Vérifiez l'ID dans index.html"); // AJOUTE CE CONSOLE.ERROR - SI btnModifier EST NULL
    }

    const btnCloseModal = document.querySelector(".modal-close");
    console.log("btnCloseModal:", btnCloseModal); // AJOUTE CE CONSOLE.LOG - VÉRIFIER SI btnCloseModal EST NULL OU PAS

    if (btnCloseModal) { // AJOUTE CE IF - VÉRIFIER SI btnCloseModal EXISTE AVANT D'AJOUTER L'ÉCOUTEUR D'ÉVÉNEMENT
        btnCloseModal.addEventListener("click", function () {
            modal.style.display = "none";
            console.log("Modale fermée (croix) !"); // AJOUTE CE CONSOLE.LOG - TEST FERMETURE CROIX
        });
    } else {
        console.error("Erreur : btnCloseModal est null ! Vérifiez la classe dans index.html"); // AJOUTE CE CONSOLE.ERROR - SI btnCloseModal EST NULL
    }

    const modalOverlay = document.querySelector(".modal-overlay");
    console.log("modalOverlay:", modalOverlay); // AJOUTE CE CONSOLE.LOG - VÉRIFIER SI modalOverlay EST NULL OU PAS

    if (modalOverlay) { // AJOUTE CE IF - VÉRIFIER SI modalOverlay EXISTE AVANT D'AJOUTER L'ÉCOUTEUR D'ÉVÉNEMENT
        modalOverlay.addEventListener("click", function () {
            modal.style.display = "none";
            console.log("Modale fermée (overlay) !"); // AJOUTE CE CONSOLE.LOG - TEST FERMETURE OVERLAY
        });
    } else {
        console.error("Erreur : modalOverlay est null ! Vérifiez la classe dans index.html"); // AJOUTE CE CONSOLE.ERROR - SI modalOverlay EST NULL
    }

} else {
    console.error("Erreur : modal est null ! Vérifiez l'ID dans index.html"); // AJOUTE CE CONSOLE.ERROR - SI modal EST NULL
}

btnModifier.addEventListener("click", function () {
    console.log("🔹 Clic détecté sur 'modifier-button' !");
    modal.style.display = "block";
});
