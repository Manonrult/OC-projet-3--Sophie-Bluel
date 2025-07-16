//Constantes 
const baseurl = "http://localhost:5678/api";
//Début du code
    //Ajout projets
ajoutProjets(); //appeler fonction 
    //
ajoutCategories();


//Fonctions
    //Afficher les projets en dynamique
async function ajoutProjets(){
    const reponse = await fetch(baseurl+"/works");
    const listeProjets = await reponse.json();
    console.log(listeProjets);
    let gallery = document.querySelector(".gallery"); //récupérer balise gallery du html à modifier
    
    listeProjets.forEach(projet => {
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
    });
}

    //Menu catégories 
async function ajoutCategories(){
    const reponse = await fetch(baseurl+"/categories");
    const boutonCategories = await reponse.json();
    console.log(boutonCategories);

    let categories = document.querySelector(".categories");

    const boutonTous = document.createElement("li");
    boutonTous.textContent = "Tous"
    categories.appendChild(boutonTous);

    boutonCategories.forEach(bouton => {
        const nomCategorie = document.createElement("li");
        nomCategorie.textContent = bouton.name;

       categories.appendChild(nomCategorie);
       
    })
}
