updateLoginLink();


//Fonctions 
    //Affichage Logout à la connexion
function updateLoginLink(){
    const loginLogoutLink = document.querySelector('nav ul li a[href="login.html"]');
    const modeEdition = document.getElementById('mode-edition');
    const editerProjetsSpan = document.getElementById('editer-projets');
    const token = localStorage.getItem('authToken');
console.log ('toto');
    if(loginLogoutLink){
        
console.log ('titi');
        if (token) {
            // si l'utiloisation est connecté
            loginLogoutLink.textContent = 'logout';
            loginLogoutLink.href ='#'; //le lien ne mêne plus à login.html
            //Afficher élément édition
            if(modeEdition){
                modeEdition.style.display = 'block'
            }
            if(editerProjetsSpan){
                editerProjetsSpan.style.display = 'inline'
            }

            //pour la déconnection 
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