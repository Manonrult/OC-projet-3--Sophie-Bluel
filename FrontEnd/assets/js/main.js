// 1. URL de l'API pour récupérer les œuvres (route GET /works de ton backend)
const apiUrlWorks = 'http://localhost:5678/api/works'; // ⚠️ VERIFIEZ ET ADAPTEZ LE PORT SI NECESSAIRE !

fetch(apiUrlWorks)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        return response.json();
    })
    .then(works => {
        console.log('Données des œuvres récupérées de l\'API:', works); // Affiche les données dans la console

        afficherGalerie(works);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des œuvres depuis l\'API:', error);
    });

function afficherGalerie(works) {
    const galleryDiv = document.querySelector(".gallery"); // ✅ Le sélecteur CSS ".gallery" est CORRECT d'après ton index.html

    galleryDiv.innerHTML = '';

    works.forEach(work => {
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");

        // ⚠️ 2. VERIFIEZ ET REMPLACEZ "nomDuChampImageURL" par le VRAI NOM DU CHAMP pour l'URL de l'image DANS LA REPONSE DE VOTRE API
        imageElement.src = work.nomDuChampImageURL; // ⚠️ PLACEHOLDER - A REMPLACER !

        // ⚠️ 3. VERIFIEZ ET REMPLACEZ "nomDuChampTitre" par le VRAI NOM DU CHAMP pour le titre de l'œuvre DANS LA REPONSE DE VOTRE API
        imageElement.alt = work.nomDuChampTitre;   // ⚠️ PLACEHOLDER - A REMPLACER !
        const captionElement = document.createElement("figcaption");
        captionElement.textContent = work.nomDuChampTitre; // ⚠️ PLACEHOLDER - A REMPLACER !

        figureElement.appendChild(imageElement);
        figureElement.appendChild(captionElement);

        galleryDiv.appendChild(figureElement);
    });
}