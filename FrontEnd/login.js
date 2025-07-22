//Début du code 

        boutonConnexion();

//Fonctions 


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
            const pError = document.querySelector(".error-message");
            pError.textContent = errorMessage;
            
            console.error('Erreur API (HTTP:',reponse.status, data)
        }

    }catch (error){
        showMessage('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
        console.error('Erreur de reseau ou de parsing Json:');
    }
}

