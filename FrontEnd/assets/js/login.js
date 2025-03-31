document.addEventListener("DOMContentLoaded", () => {
    /**
     * Bloc 1: Gestion du formulaire de connexion.
     * Sélectionne le formulaire de login et la zone d'affichage des erreurs.
     * Ajoute un écouteur d'événement pour la soumission du formulaire afin de gérer la connexion de l'utilisateur.
     */
    const formLogin = document.querySelector(".form-login");
    const messageErreur = document.getElementById("message-erreur");

    if (formLogin) {
        /**
         * Sous-bloc 1.1: Écouteur d'événement pour la soumission du formulaire de connexion.
         * Empêche la soumission par défaut, récupère les identifiants (email et mot de passe),
         * envoie une requête POST à l'API de login et gère la réponse (succès ou erreur).
         */
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const loginData = { email, password };

            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                if (!response.ok) {
                    messageErreur.textContent = "Identifiants incorrects !";
                    messageErreur.style.display = "block";
                    return;
                }

                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "isAdmin",
                    email === "sophie.bluel@test.tld" ? "true" : "false"
                );

                window.location.href = "index.html";
            } catch (error) {
                messageErreur.textContent = "Problème de connexion.";
                messageErreur.style.display = "block";
            }
        });
    }

    /**
     * Bloc 2: Gestion du lien Login/Logout dans la navigation.
     * Sélectionne le lien de login dans la navigation et récupère le token et le rôle admin depuis le stockage local.
     * Si un token et le rôle admin sont présents, transforme le lien en "Logout" et ajoute un comportement de déconnexion.
     * Exemple de concaténation dans ce bloc : modification de loginLink.href avec '#' (bien que simple, '#' est concaténé à l'URL actuelle).
     */
    const loginLink = document.querySelector(".nav-login");
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (loginLink && token && isAdmin) {
        loginLink.textContent = "Logout";
        loginLink.href = "#"; // Exemple simple de concaténation: '#' est ajouté à la fin de l'URL (même si cela ne change pas l'URL ici).
        loginLink.style.fontWeight = "bold";

        /**
         * Sous-bloc 2.1: Écouteur d'événement pour la déconnexion (Logout).
         * Ajout d'un écouteur d'événement au lien "Logout" pour gérer la déconnexion de l'utilisateur.
         * Efface les données du stockage local (token, isAdmin) et recharge la page pour mettre à jour l'interface.
         */
        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }
});