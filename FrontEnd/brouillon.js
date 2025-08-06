


croixFermer.forEach(element =>{
    element.addEventListener('click', () =>{
        console.log("Dans le click");
        modalGlobal.style.display= 'none';
        modalGalerie.style.display= 'none';
        modalAjoutPhoto.style.display='none';
        modalGlobal.setAttribute('inert','');
        modalGlobal.removeAttribute('aria-hidden'); //cache la modale des lecteurs 

        reinitialiserFormulaireAjout();