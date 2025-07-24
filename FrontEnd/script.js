//Constantes 
const baseurl = "http://localhost:5678/api";
const worksSet = new Set(); //stocker les projets chargés par l'api

//Début du code(rechargement page)
initialiserPage();


//Fonctions

async function initialiserPage(){
    console.log("Initialisation de la page");
    await recupererProjets();
    ajoutProjets(0); //appeler fonction 
    ajoutCategories();
    ouvrirModal();
    fermerModal();
    }

async function recupererProjets(){
    const reponse = await fetch(baseurl+"/works");
    const listeProjets = await reponse.json();
    console.log(listeProjets);
    listeProjets.forEach(projet => {
        worksSet.add(projet);
    });
}
    //Afficher les projets en dynamique
async function ajoutProjets(idCategorie){
    console.log(worksSet.size)
    let gallery = document.querySelector(".gallery"); //récupérer balise gallery du html à modifier
    gallery.innerHTML=""; //vider la galerie

    //Récupérer le conteneteur pour les miniatures dans le modal
    let galerieMiniatures = document.getElementById("galerie-miniatures");
    galerieMiniatures.innerHTML=""; //vider galerie du modal avant d'ajouter de nouvelles images : ??
    
    worksSet.forEach(function (projet){
        //filtre 
    if (idCategorie==projet.category.id||idCategorie==0){
     //Création figure
     const figure = document.createElement("figure");

     //Création img
     const imageFigure = document.createElement("img");
        imageFigure.src = projet.imageUrl;
        imageFigure.alt = projet.title;

     //Création figcaption
     const figcaption = document.createElement("figcaption");
         figcaption.textContent = projet.title;

     //Rattacher les éléments à l'élément parent 
     figure.appendChild(imageFigure);
     figure.appendChild(figcaption);

     //ajouter à la gallery
     gallery.appendChild(figure);
    }
    const divMiniature = document.createElement("div");
        divMiniature.classList.add("miniature-item"); //ajout d'une class pour style

    const imgMiniature = document.createElement("img");
        imgMiniature.src = projet.imageUrl;
        imgMiniature.alt = projet.title;

    const iconeSupprimer = document.createElement("i");
        iconeSupprimer.classList.add("fa-solid", "fa-trash-can");
        //iconeSupprimer.dataset.projectId = projet.id; // Stocker l'ID du projet pour une future suppression si tu en as besoin

    divMiniature.appendChild(imgMiniature);
    divMiniature.appendChild(iconeSupprimer);
    galerieMiniatures.appendChild(divMiniature);
    });

}

    //Menu catégories 
async function ajoutCategories(){
    const reponse = await fetch(baseurl+"/categories");
    const boutonCategories = await reponse.json();
    console.log(boutonCategories);

    let categories = document.querySelector(".categories");

    const boutonTous = document.createElement("li");
    boutonTous.textContent = "Tous";
    boutonTous.addEventListener('click',()=>{
        console.log("Bouton cliqué");
        ajoutProjets(0);
    });
    categories.appendChild(boutonTous);

    boutonCategories.forEach(bouton => {
        const nomCategorie = document.createElement("li");
        nomCategorie.textContent = bouton.name;
        nomCategorie.addEventListener('click',()=>{
            console.log("Bouton cliqué");
            ajoutProjets(bouton.id);
        });
            
        categories.appendChild(nomCategorie);
    })
}

    //Apparition & disparition fenêtre modale
function ouvrirModal(){
    console.log("debut fonction");
    const lienModifier = document.querySelectorAll(".ouvrir-modal-galerie");
    const modalGlobal = document.getElementById("modal");
    const modalGalerie = document.getElementById("modal-galerie-photo");

    if(modalGlobal){
        modalGlobal.setAttribute('role', 'dialog');
        modalGlobal.setAttribute('aria-modal', 'true');
        modalGlobal.setAttribute('aria-labelledby', 'modalTitle');
    }

    lienModifier.forEach(element =>{
        element.addEventListener('click', () =>{
            console.log("Dans le click");
            modalGlobal.style.display= 'flex';
            modalGalerie.style.display= 'block';
            modalGlobal.removeAttribute('aria-hidden'); //rendre la modale visible aux lecteurs d'écran
            ajoutProjets(0);//met à jour la galerie principale ET la modale
        });
    });
}
//fermeture modal par la croix
function fermerModal(){
    const croixFermer = document.querySelectorAll(".js-modal-fermer");
    const modalGlobal = document.getElementById("modal");
    const modalGalerie = document.getElementById("modal-galerie-photo");

    croixFermer.forEach(element =>{
        element.addEventListener('click', () =>{
            console.log("Dans le click");
            modalGlobal.style.display= 'none';
            modalGalerie.style.display= 'none';
            modalGlobal.removeAttribute('aria-hidden', 'true'); //cache la modale des lecteurs 
        });
    });
//fermeture en dehors du modal 
modalGlobal.addEventListener('click', (event) => { //modalGlobal=gère le contenu du modale + le vide autour
    if (event.target ===modalGlobal){ //event se passe lorsqu'il y a un click, seulement sur l'arrière plan 
        console.log("Fermture en cliquant à côté du modal");
        modalGlobal.style.display= 'none';
        modalGalerie.style.display= 'none';
        modalGlobal.removeAttribute('aria-hidden', 'true');
    }
})
}
