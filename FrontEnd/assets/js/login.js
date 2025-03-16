// login.js

document.addEventListener("DOMContentLoaded", function () { // AJOUTE CET ÉCOUTEUR D'ÉVÉNEMENT "DOMContentLoaded" QUI ENVELOPPE TOUT LE RESTE DU CODE

    console.log("DOMContentLoaded : Le DOM est entièrement chargé et parsé !"); // AJOUTE CE CONSOLE.LOG - TEST DOMContentLoaded

    // Sélection des éléments du DOM (formulaire et message d'erreur)
    const formLogin = document.querySelector(".form-login");
    const messageErreur = document.getElementById("message-erreur");

    console.log("formLogin avant addEventListener:", formLogin); // AJOUTE CE CONSOLE.LOG - VÉRIFIER formLogin JUSTE AVANT addEventListener

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const loginData = {
            email: email,
            password: password
        };
        console.log("loginData construit:", loginData); // AJOUTE CE CONSOLE.LOG - TEST LOGINDATA

        const apiUrlLogin = "http://localhost:5678/api/users/login";
        console.log("URL de l'API:", apiUrlLogin); // AJOUTE CE CONSOLE.LOG - TEST APIURL

        try {
            console.log("Début du bloc try...catch"); // AJOUTE CE CONSOLE.LOG - TEST TRY

            const response = await fetch(apiUrlLogin, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            console.log("Requête fetch envoyée, réponse reçue:", response); // AJOUTE CE CONSOLE.LOG - TEST FETCH RESPONSE

            // 7. Gestion de la réponse de l'API
            if (response.ok) { // Si la réponse HTTP est un succès (code 2xx)
                console.log("Connexion réussie (response.ok est true) !"); // AJOUTE CE CONSOLE.LOG - TEST response.ok == true
                const data = await response.json(); // Parse la réponse JSON pour obtenir les données
                console.log("response.json() terminé, data:", data); // AJOUTE CE CONSOLE.LOG - APRÈS response.json(), AFFICHER data
                const token = data.token; // Récupère le token d'authentification depuis la réponse JSON (vérifie le nom exact de la propriété dans Swagger)
                console.log("Token récupéré du JSON de réponse:", token); // AJOUTE CE CONSOLE.LOG - APRÈS RÉCUPÉRATION DU TOKEN, AFFICHER token
                console.log("Avant localStorage.setItem('token', token); Token:", token); // AJOUTE CE CONSOLE.LOG - AVANT localStorage.setItem
                localStorage.setItem("token", token); // LIGNE DE STOCKAGE DU TOKEN
                console.log("Après localStorage.setItem('token', token); Token stocké:", localStorage.getItem("token")); // AJOUTE CE CONSOLE.LOG - APRÈS localStorage.setItem
                window.location.href = "index.html";
                console.log("Redirection vers la page d'accueil effectuée !"); // AJOUTE CE CONSOLE.LOG - APRÈS REDIRECTION
                console.log("Connexion réussie ! Token stocké."); // Message de confirmation dans la console (pour le développement)
            } else {
                // Si la connexion a échoué (erreur 4xx ou 5xx)
                console.error("Erreur de connexion:", response.status, response.statusText); // Log l'erreur dans la console (pour le débogage)
                messageErreur.textContent = "Erreur d'authentification. Veuillez vérifier vos identifiants."; // Affiche un message d'erreur à l'utilisateur
                messageErreur.style.display = "block"; // Affiche l'élément de message d'erreur (rend visible)
                console.log("Connexion échouée (response.ok est false) ! Code d'état:", response.status, response.statusText); // AJOUTE CE CONSOLE.LOG - TEST response.ok == false
            }

        } catch (error) {
            console.error("Erreur Fetch:", error); // Log l'erreur dans la console (pour le débogage)
            messageErreur.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard."; // Affiche un message d'erreur générique à l'utilisateur
            messageErreur.style.display = "block"; // Affiche l'élément de message d'erreur (rend visible)
            console.log("Erreur dans le bloc catch:", error); // AJOUTE CE CONSOLE.LOG - TEST CATCH
        }
    });

}); // FIN DE L'ÉCOUTEUR D'ÉVÉNEMENT "DOMContentLoaded"