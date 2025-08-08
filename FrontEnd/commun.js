updateLoginLink();

//Fonctions 
    //Affichage Logout à la connexion
 export function updateLoginLink(){
    const loginLogoutLink = document.querySelector('nav ul li a[href="login.html"]');
    const modeEdition = document.getElementById('mode-edition');
    const editerProjetsSpan = document.getElementById('editer-projets');
    const token = localStorage.getItem('authToken');
    if(loginLogoutLink){
                if (token) {
            // si l'utilisateur est connecté
            loginLogoutLink.textContent = 'logout';
            loginLogoutLink.href ='#'; //le lien ne mène plus à login.html
            //Afficher élément édition
            if(modeEdition){
                modeEdition.style.display = 'block'
            }
            if(editerProjetsSpan){
                editerProjetsSpan.style.display = 'inline'
            }

            //pour la déconnexion 
            loginLogoutLink.addEventListener('click', (event)=>{
                event.preventDefault();
                localStorage.removeItem('authToken');
                console.log('Token API supprimé.');
                //recharger la page avec la mise à jour du mot
                window.location.href = 'index.html';
            });
        }
    }
}