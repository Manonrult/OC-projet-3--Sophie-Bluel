document.addEventListener("DOMContentLoaded", () => {
    // === FORMULAIRE DE CONNEXION ===
    const formLogin = document.querySelector(".form-login");
    const messageErreur = document.getElementById("message-erreur");

    if (formLogin) {
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

    // === LIEN LOGIN → LOGOUT ===
    const loginLink = document.querySelector(".nav-login");
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (loginLink && token && isAdmin) {
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.style.fontWeight = "bold";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }
});
