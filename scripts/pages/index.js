import photographerTemplate  from '../templates/photographer.js'; 
async function getPhotographers() {
  try {
      const reponse = await fetch("../data/photographers.json");
    const {photographers} = await reponse.json();
    return photographers;
  } catch (error) {
    console.log("Erreur lors de la récupération des photographes")
    
  }

  }

  async function init() {
    const photographers = await getPhotographers();
    if (photographers && photographers.length > 0) {
      const photographersSection = document.querySelector(".photographer_section");
      photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
      });
    }
  }
    
    init();
    
