import photographerTemplate  from '../templates/photographer.js'; 
async function getPhotographers() {
  try {
      const reponse = await fetch("data/photographers.json");
    const {photographers} = await reponse.json();
    console.log(photographers);
    return photographers;
  } catch (error) {
    console.log("Erreur lors de la récupération des photographes")
    
  }

  }

  async function init() {
    const photographers = await getPhotographers();
    if (photographers) {
     photographers.forEach( => {
    photographerTemplate(photograph);  });
    }
    
               
    }
    
    init();
    
