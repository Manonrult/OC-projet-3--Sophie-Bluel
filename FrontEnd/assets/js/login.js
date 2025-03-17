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
