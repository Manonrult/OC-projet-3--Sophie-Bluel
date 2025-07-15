//Début du code
    //Ajout projets
ajoutProjets(); //appeler fonction 

//Fonctions
async function ajoutProjets(){
    const reponse = await fetch("http://localhost:5678/api/works");
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

