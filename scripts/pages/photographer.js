import mediaTemplate  from '../templates/media.js'; 
import photographerHeaderTemplate from '../templates/photographerHeader.js';

async function getPhotographersAndMedia() {
    try {
      const response = await fetch("../data/photographers.json");
      const data = await response.json();
      const { photographers, media } = data;
      console.log(photographers, media);
      return { photographers, media };
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return { photographers: [], media: [] };
    }
  }
  async function init() {
    const { photographers, media } = await getPhotographersAndMedia();
    const id = new URLSearchParams(window.location.search).get("id"); // Récupère l'ID depuis l'URL

    if (photographers && photographers.length && media && media.length > 0) {
        const photographerSection = document.querySelector(".photograph-header");
        const photographer = photographers.find((photographer) => photographer.id === parseInt(id));

        if (photographer) {
            const photographerModel = photographerHeaderTemplate(photographer);
            const photographerDOM = photographerModel.getPhotoDOM();
            photographerSection.appendChild(photographerDOM);
        } else {
            console.error("Photographe introuvable avec l'ID fourni !");
        }

        console.log(photographer)

        const main = document.querySelector("main");
        const mediaSection = document.createElement("section");
        mediaSection.setAttribute("class", "media-section");
        main.appendChild(mediaSection);

        // Filtrer les médias correspondant à l'ID du photographe
        const filteredMedia = media.filter((item) => item.photographerId === parseInt(id));

        // Boucler sur les médias filtrés
        filteredMedia.forEach((media) => {
            const mediaModel = mediaTemplate(media, photographers);
            const mediaCardDOM = mediaModel.getMedia();
            mediaSection.appendChild(mediaCardDOM);
        });
    } else {
        console.error("Aucun photographe ou média trouvé !");
    }

}
  init()
