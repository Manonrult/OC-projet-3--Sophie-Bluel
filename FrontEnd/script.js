//Constantes 
const baseurl = "http://localhost:5678/api";
const worksSet = new Set(); //stocker les projets chargés par l'api

//Début du code(rechargement page)
initialiserPage();


//Fonctions

async function initialiserPage(){
    await recupererProjets();
    ajoutProjets(0); //appeler fonction 
    ajoutCategories();
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
async function ajoutProjets(id){
    console.log(worksSet.size)
    let gallery = document.querySelector(".gallery"); //récupérer balise gallery du html à modifier
    gallery.innerHTML=""; //vider la galerie
    
    worksSet.forEach(function (projet){
    if (id==projet.category.id||id==0){
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
