//Début du code 

        boutonConnexion();

//Fonctions 
function displayErrorMessage(message) {
    const pError = document.querySelector(".error-message"); 
    if (pError) {
        pError.textContent = message;
    }
}
    //Click
function boutonConnexion() {
    const boutonlogin = document.querySelector(".boutonlogin");
    boutonlogin.addEventListener('click', async (event)=>{
        event.preventDefault();
        console.log("Bouton cliqué");
        await login();
    });      
}


async function login() {
    //2.Récupérer id & pwd dans HTML
    const emailInput = document.getElementById("email");
    const email = emailInput.value;
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;

    //Validation RegExp
    let emailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9]+");
    let reponseEmail = emailRegex.test(email);
    console.log(reponseEmail);

    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$");
    let reponsePassword = passwordRegex.test(password);
    console.log(reponsePassword);

    //Si email && password faux alors message d'erreur
    if(!reponseEmail && !reponsePassword){
        displayErrorMessage("Format d'email et mot de passe invalide");
        return;
    }

    if(!reponseEmail){
        displayErrorMessage("Format d'email invalide.");
        console.log("Validation email échouée.");
        return;
        }
        
    if(!reponsePassword){
        displayErrorMessage("Mot de passe invalide.");
        console.log("Validation mot de passe échoué.");
        return;
    }

    try {
        const apiEndpoint = "http://localhost:5678/api/users/login";
        const reponse = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
            const data = await reponse.json();

        if (reponse.ok) {
            //récupérer le token et stocker le token dans un local storage
            if (data.token){
                localStorage.setItem('authToken', data.token);
                console.log('Token API stocké:',data.token);
                updateLoginLink();
            } else {
                console.warn('l\'API n\'a pas renvoyé de token')
            }
            //Rediriger vers page d'accueil 
            setTimeout(() => {
                window.location.href = 'index.html';
            });
        }else {
            const errorMessage = data.message || `Erreur HTTP: ${reponse.status}. Une erreur inconnue est survenue.`;
            displayErrorMessage(errorMessage);
            
            console.error('Erreur API (HTTP:',reponse.status, data)
        }

    }catch (error){
        displayErrorMessage('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        console.error('Erreur de reseau ou de parsing Json:');
    }
}

