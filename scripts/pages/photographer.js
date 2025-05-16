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
        let currentMediaIndex = 0;

        // Fonction pour ouvrir la lightbox sur un média donné
        function openLightbox(index) {
            const lightbox = document.getElementById("lightbox");
            const lightboxContent = document.getElementById("lightbox-content");
            lightboxContent.innerHTML = "";

            const mediaItem = filteredMedia[index];
            let element;
            if (mediaItem.image) {
                element = document.createElement("img");
                element.src = `assets/sample_photos/${photographer.name}/${mediaItem.image}`;
                element.alt = mediaItem.title;

            } else if (mediaItem.video) {
                element = document.createElement("video");
                element.src = `assets/sample_photos/${photographer.name}/${mediaItem.video}`;
                element.setAttribute("controls", "");
                element.setAttribute("autoplay", "");
                element.setAttribute("muted", "");

            }
            lightboxContent.appendChild(element);
            lightbox.style.display = "flex";
            currentMediaIndex = index;
        }

        // Ajoute l'événement sur chaque média pour ouvrir la lightbox
        document.querySelectorAll(".media-card img, .media-card video").forEach((el, idx) => {
            el.addEventListener("click", () => openLightbox(idx));
        });

        // Navigation avec les flèches
        document.getElementById("lightbox-prev").onclick = function () {
            currentMediaIndex = (currentMediaIndex - 1 + filteredMedia.length) % filteredMedia.length;
            openLightbox(currentMediaIndex);
        };
        document.getElementById("lightbox-next").onclick = function () {
            currentMediaIndex = (currentMediaIndex + 1) % filteredMedia.length;
            openLightbox(currentMediaIndex);
        };

        // Fermer la lightbox
        document.getElementById("lightbox-close").onclick = function () {
            document.getElementById("lightbox").style.display = "none";
        };

        // Boucler sur les médias filtrés
        filteredMedia.forEach((media) => {
            const mediaModel = mediaTemplate(media, photographers);
            const mediaCardDOM = mediaModel.getMedia();
            mediaSection.appendChild(mediaCardDOM);
        });

        // Initialisation du compteur de likes total
        const countLikes = document.querySelectorAll(".media-likes-number");
        let totalLike = Array.from(countLikes).reduce((sum, el) => sum + parseInt(el.textContent, 10), 0);
        let total = document.querySelector("#total-likes-value");
        total.textContent = `${totalLike}`;

        // Gestion des likes individuels et du compteur total
        const likeButtons = document.querySelectorAll(".like-button");
        likeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const heartIcon = event.currentTarget.querySelector("i");
                const likesNumberElement = event.currentTarget.parentNode.querySelector(".media-likes-number");
                let likesNumber = parseInt(likesNumberElement.textContent, 10);

                if (heartIcon.classList.contains("fa-solid")) {
                    heartIcon.classList.remove("fa-solid");
                    heartIcon.classList.add("fa-regular");
                    likesNumber--;
                    totalLike--;
                    total.textContent = `${totalLike}`;
                } else {
                    heartIcon.classList.remove("fa-regular");
                    heartIcon.classList.add("fa-solid");
                    likesNumber++;
                    totalLike++;
                    total.textContent = `${totalLike}`;
                }
                likesNumberElement.textContent = likesNumber;
            });
        });
    } else {
        console.error("Aucun photographe ou média trouvé !");
    }
}
  init()
