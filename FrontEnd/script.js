//Constantes 
const baseurl = "http://localhost:5678/api";
const worksSet = new Set(); //stocker les projets chargés par l'api
let categorieFiltreActive = 0;

//Eléments du formulaire d'ajout de projet
const formAddProjet = document.getElementById('formulaire-titre-categorie');
const inputTitre = document.getElementById('titre');
const selectCategorie = document.getElementById('select-categorie');
const fileInput = document.getElementById('fileInput');
const submitBoutonValider = document.getElementById('submitBoutonValider');
//Récupération 3 fenêtres modales
const modalGlobal = document.getElementById("modal");
const modalGalerie = document.getElementById("modal-galerie-photo");
const modalAjoutPhoto = document.getElementById("modal-ajout-photo")

//Début du code(rechargement page)
initialiserPage();


//Fonctions

async function initialiserPage(){
    console.log("Initialisation de la page");
    await recupererProjets();
    ajoutProjets(0); //appeler fonction avec la catégorie "Tous"
    ajoutCategories();
    ouvrirModal();
    fermetureModalClick();
    pageNewProjet();
    configureExplorateurFichiers();
    gererRetourModal()
    checkAddPhotoForm(); //pour vérifier l'état du formulaire de chargement 
}
    //Récupération liste de projets via API
async function recupererProjets(){
    worksSet.clear();
    const reponse = await fetch(baseurl+"/works");
    const listeProjets = await reponse.json();
    listeProjets.forEach(projet => {
        worksSet.add(projet);
    });
}
    //Afficher les projets en dynamique en fonction de la catégorie, sur la page + miniatures dans fenêtre modale 
async function ajoutProjets(idCategorie){
    //1.Préparation des Galerie 
        //Récupérer le conteneur HTML pour la galerie principale de la page 
    let gallery = document.querySelector(".gallery"); 
    gallery.innerHTML=""; //vider la galerie

        //Récupérer le conteneur pour les miniatures dans la modale
    let galerieMiniatures = document.getElementById("galerie-miniatures");
    galerieMiniatures.innerHTML=""; //vider galerie du modal avant d'ajouter de nouvelles images 

    //2.Parcourir et filtrer les projets
    worksSet.forEach(function (projet){ 
        //ligne de filtrage 
    if (idCategorie == projet.category.id||idCategorie == 0){ 
    //3.Création des éléments pour la galerie principale 
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

    //4.Création des éléments pour la galerie miniatures
    if (idCategorie == projet.category.id || idCategorie == 0){
        const divMiniature = document.createElement("div");
        divMiniature.classList.add("miniature-item"); //ajout d'une class pour style
        //Création img
    const imgMiniature = document.createElement("img");
        imgMiniature.src = projet.imageUrl;
        imgMiniature.alt = projet.title;
        //Création icône supprimer 
    const iconeSupprimer = document.createElement("i");
        iconeSupprimer.classList.add("fa-solid", "fa-trash-can");
        iconeSupprimer.dataset.projectId = projet.id; // Stocker l'ID du projet pour une future suppression 
        iconeSupprimer.addEventListener('click',async (event)=>{
            const idProjetASupprimer = event.currentTarget.dataset.projectId; //pour lier l'id unique du projet à l'icône suppression
            console.log("ID du projet à supprimer:",idProjetASupprimer);
            await supprimerProjet(idProjetASupprimer);
        });

    divMiniature.appendChild(imgMiniature);
    divMiniature.appendChild(iconeSupprimer);
    galerieMiniatures.appendChild(divMiniature);
    };
})};

    //Créer les boutons de filtrage + remplir la liste déroulante dans le formulaire d'ajout de projet
async function ajoutCategories(){
    const boutonCategories = await recupererCategories();

    let categories = document.querySelector(".categories");
    let categorieSelect = document.getElementById("select-categorie");
        //Création bouton "Tous"
    const boutonTous = document.createElement("li");
    boutonTous.textContent = "Tous";
    boutonTous.addEventListener('click',()=>{
        console.log("Bouton cliqué");
        categorieFiltreActive = 0;
        ajoutProjets(0);
    });
    categories.appendChild(boutonTous);
        //Autres catégories
    boutonCategories.forEach(categorie => {
            //Gestion boutons projets
        const nomCategorieBtn = document.createElement("li");
        nomCategorieBtn.textContent = categorie.name;
        nomCategorieBtn.addEventListener('click',()=>{
            categorieFiltreActive = categorie.id;
            console.log("Bouton cliqué");
            ajoutProjets(categorie.id);
        });
        categories.appendChild(nomCategorieBtn);
            //Gestion formulaire
        const nomCategorieOption = document.createElement ("option");
        nomCategorieOption.textContent = categorie.name;
        nomCategorieOption.id = categorie.id;

        categorieSelect.appendChild(nomCategorieOption);

    });
}

async function recupererCategories() {
    const reponse = await fetch(baseurl + "/categories");
    const boutonCategories = await reponse.json();
    return boutonCategories;
}

//Apparition fenêtre modale
function ouvrirModal(){
    const lienModifier = document.querySelectorAll(".ouvrir-modal-galerie");
    const modalGlobal = document.getElementById("modal");
    const modalGalerie = document.getElementById("modal-galerie-photo");

    if(modalGlobal){
        modalGlobal.setAttribute('role', 'dialog');
        modalGlobal.setAttribute('aria-modal', 'true');
        modalGlobal.setAttribute('aria-labelledby', 'modalTitle');
        modalGlobal.removeAttribute('inert');
    }

    lienModifier.forEach(element =>{
        element.addEventListener('click', () =>{
            console.log("Dans le click");
            modalGlobal.style.display= 'flex';
            modalGalerie.style.display= 'block';
            modalGlobal.removeAttribute('aria-hidden'); //rendre la modale visible aux lecteurs d'écran
            modalGlobal.removeAttribute('inert');
            ajoutProjets(categorieFiltreActive);//met à jour la galerie miniature en lien avec la catégorie sélectionnée sur la galerie principale 
    });
});
}
    //Fonction fermer 3 fenêtres modale
function fermerModal() {
        console.log("Fermeture des modales")
        modalGlobal.style.display = 'none';
        modalGalerie.style.display = 'none';
        modalAjoutPhoto.style.display = 'none';
        modalGlobal.setAttribute('inert', '');
        modalGlobal.removeAttribute('aria-hidden'); //cache la modale des lecteurs 
        reinitialiserFormulaireAjout();
        formulaireIncomplet(false);
    }
    //Fermeture au click (croix + en dehors modale)
function fermetureModalClick(){
        const croixFermer = document.querySelectorAll(".js-modal-fermer");
    
        croixFermer.forEach(element =>{
            element.addEventListener('click', () =>{
                fermerModal();
                });
        });

    modalGlobal.addEventListener('click', (event) => { //modalGlobal=gère le contenu du modale + le vide autour
        if (event.target === modalGlobal){ //event se passe lorsqu'il y a un click, seulement sur l'arrière plan 
            console.log("Fermeture en cliquant à côté du modal");
            fermerModal();
        };
    });
}

//fonction supprimer projet
async function supprimerProjet(idProjetASupprimer){
    const token = localStorage.getItem('authToken');
    const urlSuppression = baseurl + "/works/" + idProjetASupprimer;
    console.log(urlSuppression);

    const reponse = await fetch(urlSuppression,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (reponse.ok){
        console.log(`Projet avec l'ID ${idProjetASupprimer} supprimé avec succès !`)
    }
    //MAJ worksSet
    worksSet.forEach((projet, _index, set) =>{
        if (projet.id === parseInt(idProjetASupprimer)){
                set.delete(projet);
        }
    });
    ajoutProjets(categorieFiltreActive); //raffraichir page d'accueil + modale 
}

//fonction  ouverture modale formulaire, validation et envoi d'un nouveau projet au back-end 
async function pageNewProjet(){
    //1.Ouverture modale d'Ajout de projet 
    const boutonAjouter = document.querySelector(".js-modal-add-photo");
    const modalGlobal = document.getElementById("modal");
    const modalAjoutPhoto = document.getElementById("modal-ajout-photo");
    const modalGalerie = document.getElementById("modal-galerie-photo");
    
    if(modalGlobal){
        modalGlobal.setAttribute('role', 'dialog');
        modalGlobal.setAttribute('aria-modal', 'true');
        modalGlobal.setAttribute('aria-labelledby', 'modalTitle');
    }

    boutonAjouter.addEventListener('click', () =>{
        console.log("dans le click")
        modalGlobal.style.display= 'flex';
        modalAjoutPhoto.style.display= 'block';
        modalGalerie.style.display= 'none';
        modalGlobal.removeAttribute('aria-hidden');
        modalGlobal.removeAttribute('inert');
        });
    //2.Gestion et validation du formulaire 
        reinitialiserFormulaireAjout();
    
        //Ecouteurs pour la validation du formulaire d'ajout de projet 
    inputTitre.addEventListener('input', checkAddPhotoForm);
    selectCategorie.addEventListener('change', checkAddPhotoForm);
    fileInput.addEventListener('change', checkAddPhotoForm); // Appelle la fonction de vérification quand un fichier est sélectionné

    //3.Soumission du formulaire et apple à l'API
    formAddProjet.addEventListener('submit', async (event)=>{
        event.preventDefault();

        const formData = new FormData();
        //ajout des données du formulaire à l'objet formData
        formData.append('title', inputTitre.value.trim()); //.append = ajouter des données / title = nom du champ identifié par le serveur/inputTitre.value.trim=valeur de title 
            //inputTitre =élément d'entrée HTML ; .value =récupère texte saisi dans le champ ;.trim()=supprimer les espaces du début et de la fin d'une chaine de carac.
        formData.append('category', selectCategorie.options[selectCategorie.selectedIndex].id);
        formData.append('image', fileInput.files[0]);
        try{
            const token = localStorage.getItem('authToken');
            console.log("Token utilisé pour l'ajout:", token);

            const response = await fetch(baseurl + "/works", { //appel API pour envoyer objet formData au serveur 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` //autorisation de type Bearer 
                },
                body: formData //données réelles que l'on souhaite envoyer
            });
            if (!response.ok){
                const errorData = await response.json();
                throw new Error(`Erreur API: ${response.status} - ${errorData.message || response.statusText}`);
            }
            
            fermerModal();

            //Ajout nouveau projet à WorkSet + rafraichir galerie
            await recupererProjets();
            await ajoutProjets(categorieFiltreActive); //rafraîchit page 
 
        } catch (error){
            console.error('erreur lors de la soummission du formulaire', error);
            alert(`Echec de l'ajout du projet: ${error.message}`);
        }
    });
}

//Fonction vérification état du formulaire avant validation
function checkAddPhotoForm(){
    //1.Vérification état de chaque champ
    const isTitreFilled = inputTitre.value.trim() !== '';
    const isCategorieSelected = selectCategorie.value !=='';
    const isFileSelected = fileInput.files.length > 0;
    //2.Gestion validation 
    const allFieldsFilled = isTitreFilled && isCategorieSelected && isFileSelected;
    const noFieldsFilled = !isTitreFilled && !isCategorieSelected && !isFileSelected;
    const afficheMessageErreur = !(allFieldsFilled || noFieldsFilled);
    //3.MAJ interface utilisateur 
    submitBoutonValider.disabled = !allFieldsFilled;
    submitBoutonValider.style.backgroundColor = allFieldsFilled ? '#1D6154' : '#A7A7A7'; //si faux garder bouton 1D...;si vrai mettre A7,...
 
    formulaireIncomplet(afficheMessageErreur);
}

//function ouvrir explorateur fichier 
function configureExplorateurFichiers(){
    const triggerButton = document.getElementById('triggerFileInput');
    const fileInput = document.getElementById('fileInput');
    const selectionnerPhotoDiv = document.querySelector('.selectionner-photo');
    const iconImage = selectionnerPhotoDiv.querySelector('.fa-regular.fa-image');
    const paragraphText = selectionnerPhotoDiv.querySelector('p');


    if (triggerButton && fileInput){
        triggerButton.addEventListener('click', () => {
            console.log("Bouton +AjoutPhoto cliqué")
            fileInput.click();
        });
        //Sélection de fichier et affichage aperçu
        fileInput.addEventListener('change', (event) =>{
            const file = event.target.files && event.target.files[0]; //récupération du fichier sélectionné 

            const lireFichier= new FileReader();

            if (file){
                if (file.type ==='image/jpeg' || file.type === 'image/png'){
                    //validation taille fichier
                    const maxSize = 4 * 1024 * 1024; //4Mo en octets
                    if (file.size > maxSize){
                        alert("La taille de l'image ne doit pas dépasser 4 Mo");
                        fileInput.value = '';
                        return;
                    }
                        //lire fichier et afficher un aperçu
                        lireFichier.onload = function(e){
                        //masquer les éléments d'origine
                        iconImage.style.display = 'none';
                        triggerButton.style.display = 'none';
                        paragraphText.style.display = 'none';
                        selectionnerPhotoDiv.style.paddingTop = '0';

                        //supprimer un ancien aperçu si existant
                        const existantAperçu = selectionnerPhotoDiv.querySelector ('image-preview');
                        if (existantAperçu){
                            selectionnerPhotoDiv.removeChild(existantAperçu);
                        }

                        //créer et ajouter l'image d'aperçu
                        const imgAperçu = document.createElement('img');
                        imgAperçu.src = e.target.result;
                        imgAperçu.alt = "Aperçu de l'image sélectionnée";
                        imgAperçu.classList.add('img-aperçu');

                        //Style CSS 
                        imgAperçu.style.maxWidth = '100%';
                        imgAperçu.style.maxHeight = '100%';
                        imgAperçu.style.objectFit = 'contain';

                        selectionnerPhotoDiv.appendChild(imgAperçu);

                        //stocker fichier sélectionné dans variable globale
                        console.log("Fichier image sélectionné:", file.name, file.size, file.type);
                    };
                    lireFichier.readAsDataURL(file); // Lit le contenu du fichier comme une URL de données 
                     } else{
                        alert("Veuillez sélectionner un fichier image au format JPEG ou PNG.");
                        fileInput.value = '';
                     };
            };
        });
    };
}
//Function réinitialiser affichage de l'aperçu 
function reinitialiserAperçuPhoto(){
    const selectionnerPhotoDiv = document.querySelector('.selectionner-photo');
    const iconImage = selectionnerPhotoDiv.querySelector('.fa-regular.fa-image');
    const triggerButton = document.getElementById('triggerFileInput');
    const paragraphText = selectionnerPhotoDiv.querySelector('p');
    const existantAperçu = selectionnerPhotoDiv.querySelector('.img-aperçu');

    if (existantAperçu){
        selectionnerPhotoDiv.removeChild(existantAperçu);
    }
    if (iconImage) iconImage.style.display = 'block';
    if (triggerButton) triggerButton.style.display = 'block';
    if (paragraphText) paragraphText.style.display = 'block';
   
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
}

//Function pour réinitialiser complètement le formulaire d'ajout de photo
function reinitialiserFormulaireAjout(){
    //réinitialiser champs formulaire
    const form = document.getElementById('formulaire-titre-categorie');
    if (form){
        form.reset();
    };
    //appeler fonction réinitialisation aperçu image
    reinitialiserAperçuPhoto();
    //désactiver bouton "valider"
    const boutonValider = document.getElementById('boutonValider');
    if (boutonValider){
        boutonValider.setAttribute('disabled','true');
        boutonValider.style.backgroundColor =' #A7A7A7';
    };
}

// Function pour gérer le bouton de retour 
function gererRetourModal() {
    const boutonPrecedent = document.querySelector(".js-modal-precedent");
    const modalGalerie = document.getElementById("modal-galerie-photo");
    const modalAjoutPhoto = document.getElementById("modal-ajout-photo");

    if (boutonPrecedent && modalGalerie && modalAjoutPhoto) {
        boutonPrecedent.addEventListener('click', () => {
            console.log("Clic sur le bouton 'Retour': retour à la modale galerie.");
            modalAjoutPhoto.style.display = 'none'; 
            modalGalerie.style.display = 'block';   
          
            reinitialiserFormulaireAjout();  
            formulaireIncomplet(false);
        });
    };
}
//Function message erreur ajout d'un nouveau projet
function formulaireIncomplet(afficherMessage){
    const champsIncomplets = document.getElementById("champs-incomplets");
    
    if (afficherMessage) {
        champsIncomplets.style.display ='block';
    }else{
        champsIncomplets.style.display ='none';
    }; 
}
