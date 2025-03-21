document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script `login.js` chargé !");

    const formLogin = document.querySelector(".form-login");
    const messageErreur = document.getElementById("message-erreur");

    if (!formLogin) {
        console.error("❌ Erreur : Formulaire de connexion introuvable !");
        return;
    }

    console.log("📝 Formulaire trouvé, ajout d'un écouteur d'événement...");

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        console.log(`📤 Tentative de connexion avec l'email : ${email}`);

        const loginData = { email, password };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                console.error("❌ Erreur de connexion :", response.status);
                messageErreur.textContent = "⚠️ Identifiants incorrects !";
                messageErreur.style.display = "block";
                return;
            }

            const data = await response.json();
            console.log("✅ Connexion réussie ! Données reçues :", data);

            // Stocker le token
            localStorage.setItem("token", data.token);

            // Vérification admin
            if (email === "sophie.bluel@test.tld") {
                console.log("👑 L'utilisateur est ADMIN !");
                localStorage.setItem("isAdmin", "true");
            } else {
                console.log("👤 L'utilisateur est un utilisateur normal.");
                localStorage.setItem("isAdmin", "false");
            }

            // Redirection après connexion
            window.location.href = "index.html";

        } catch (error) {
            console.error("❌ Erreur lors de la requête :", error);
            messageErreur.textContent = "⚠️ Problème de connexion. Vérifie ton serveur !";
            messageErreur.style.display = "block";
        }
    });
});

// ✅ Vérifier si l'utilisateur est connecté et admin
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    console.log("🔍 Vérification connexion...");
    console.log("🔑 Token présent ?", token ? "✅ Oui" : "❌ Non");
    console.log("👑 L'utilisateur est-il admin ?", isAdmin ? "✅ Oui" : "❌ Non");

    if (!token) {
        console.warn("⚠️ Aucun utilisateur connecté.");
        return;
    }

    // ✅ Bloquer l'ajout et la suppression de photos pour les non-admins
    const btnAjouterPhoto = document.getElementById("btn-open-upload");
    if (!isAdmin && btnAjouterPhoto) {
        console.warn("🚫 Accès restreint : L'ajout de photos est désactivé pour les utilisateurs normaux.");
        btnAjouterPhoto.style.display = "none";
    }

    const deleteButtons = document.querySelectorAll(".btn-delete");
    deleteButtons.forEach(button => {
        if (!isAdmin) {
            button.style.display = "none";
        }
    });

    // ✅ Cacher les filtres si admin
    const filtersDiv = document.querySelector(".filters");
    if (isAdmin && filtersDiv) {
        console.log("🚫 Filtres cachés pour l'admin.");
        filtersDiv.style.display = "none";
    }

    
    

    document.body.appendChild(logoutButton);
});
