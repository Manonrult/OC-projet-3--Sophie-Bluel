if (!document.querySelector(".form-login")) {
    console.warn("⚠️ `login.js` est exécuté, mais `.form-login` est introuvable. Vérifie si tu es bien sur `login.html`.");
} else {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded : Le DOM est entièrement chargé et parsé !");

        // Sélection des éléments du DOM (formulaire et message d'erreur)
        const formLogin = document.querySelector(".form-login");
        const messageErreur = document.getElementById("message-erreur");

        if (!formLogin) {
            console.error("❌ Erreur : L'élément '.form-login' est introuvable dans le DOM !");
            return;
        }

        console.log("✅ L'élément .form-login a été trouvé dans le DOM.");

        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const loginData = { email, password };
            console.log("loginData construit:", loginData);

            const apiUrlLogin = "http://localhost:5678/api/users/login";
            console.log("URL de l'API:", apiUrlLogin);

            try {
                console.log("Début du bloc try...catch");

                const response = await fetch(apiUrlLogin, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                console.log("Requête fetch envoyée, réponse reçue:", response);

                if (response.ok) {
                    console.log("Connexion réussie !");
                    const data = await response.json();
                    console.log("Data reçue:", data);
                    const token = data.token;
                    console.log("Token récupéré:", token);
                    localStorage.setItem("token", token);
                    console.log("Token stocké dans localStorage.");
                    window.location.href = "index.html";
                } else {
                    console.error("Erreur de connexion:", response.status, response.statusText);
                    messageErreur.textContent = "Erreur d'authentification. Veuillez vérifier vos identifiants.";
                    messageErreur.style.display = "block";
                }
            } catch (error) {
                console.error("Erreur Fetch:", error);
                messageErreur.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.";
                messageErreur.style.display = "block";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script `modal.js` chargé !");

    // Sélectionne tous les boutons de suppression
    const deleteButtons = document.querySelectorAll(".btn-delete");

    if (deleteButtons.length === 0) {
        console.warn("⚠️ Aucun bouton de suppression trouvé. Vérifie ton HTML !");
        return;
    }

    console.log(`🟢 ${deleteButtons.length} bouton(s) de suppression détecté(s).`);

    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();

            // Récupération du token
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé. L'utilisateur doit être connecté !");
                alert("Vous devez être connecté pour supprimer un projet.");
                return;
            }
            console.log("🔑 Token récupéré avec succès.");

            // Récupération de l'ID du projet à supprimer
            const projectId = button.dataset.id; // Ex: data-id="1"
            if (!projectId) {
                console.error("❌ Impossible de récupérer l'ID du projet.");
                return;
            }

            console.log(`🗑️ Suppression demandée pour le projet ID: ${projectId}`);

            // Confirmation utilisateur
            if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) {
                console.log("❌ Suppression annulée.");
                return;
            }

            try {
                console.log(`⏳ Envoi de la requête DELETE à l'API pour le projet ID: ${projectId}...`);

                // Requête DELETE vers l'API
                const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`❌ Erreur API: ${response.status}`);
                }

                console.log(`✅ Projet ID: ${projectId} supprimé avec succès !`);

                // Supprimer l'élément du DOM après suppression réussie
                supprimerProjetDuDOM(projectId);

            } catch (error) {
                console.error("❌ Erreur lors de la suppression :", error);
            }
        });
    });
});

// Fonction pour supprimer le projet du DOM
function supprimerProjetDuDOM(id) {
    console.log(`🔍 Tentative de suppression du projet ID: ${id} dans le DOM...`);
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.remove();
        console.log(`🗑️ Projet ID: ${id} supprimé du DOM.`);
    } else {
        console.warn(`⚠️ Projet ID: ${id} introuvable dans le DOM.`);
    }
}
