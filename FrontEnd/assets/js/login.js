document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.querySelector(".form-login");
    const messageErreur = document.getElementById("message-erreur");

    if (!formLogin) {
        console.error("❌ Erreur : Formulaire de connexion introuvable !");
        return;
    }

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const loginData = { email, password };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                messageErreur.textContent = "⚠️ Identifiants incorrects !";
                messageErreur.style.display = "block";
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", email === "sophie.bluel@test.tld" ? "true" : "false");
            window.location.href = "index.html";
        } catch (error) {
            messageErreur.textContent = "⚠️ Problème de connexion.";
            messageErreur.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token) return;

    const btnAjouterPhoto = document.getElementById("btn-open-upload");
    if (!isAdmin && btnAjouterPhoto) {
        btnAjouterPhoto.style.display = "none";
    }

    const deleteButtons = document.querySelectorAll(".btn-delete");
    deleteButtons.forEach(button => {
        if (!isAdmin) button.style.display = "none";
    });

    const filtersDiv = document.querySelector(".filters");
    if (isAdmin && filtersDiv) filtersDiv.style.display = "none";

    // 🔓 Bouton logout
    const logoutButton = document.createElement("button");
    logoutButton.id = "logout-button";
    logoutButton.textContent = "Déconnexion";
    logoutButton.addEventListener("click", () => {
        localStorage.clear();
        window.location.reload();
    });

    document.body.appendChild(logoutButton);
});
