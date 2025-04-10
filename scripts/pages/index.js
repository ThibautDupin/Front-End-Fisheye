async function getPhotographers() {
    const reponse = await fetch("data/photographers.json");
    const photographers = await reponse.json();
    console.log(photographers);
    return photographers;
  }
    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        console.log(photographers);
        
    }
    
    init();
    
