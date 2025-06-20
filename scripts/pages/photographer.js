import mediaTemplate from "../templates/media.js";
import photographerHeaderTemplate from "../templates/photographerHeader.js";

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

function sortMedia(mediaArray, criterion, order = "desc") {
    let sorted;
    switch (criterion) {
        case "popularity":
            sorted = [...mediaArray].sort((a, b) => b.likes - a.likes);
            break;
        case "date":
            sorted = [...mediaArray].sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "title":
            sorted = [...mediaArray].sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            sorted = mediaArray;
    }
    if (order === "asc") {
        sorted.reverse();
    }
    return sorted;
}

async function init() {
  const { photographers, media } = await getPhotographersAndMedia();
  const id = new URLSearchParams(window.location.search).get("id"); // Récupère l'ID depuis l'URL

  if (photographers && photographers.length && media && media.length > 0) {
    const photographerSection = document.querySelector(".photograph-header");
    const photographer = photographers.find(
      (photographer) => photographer.id === parseInt(id)
    );

    if (photographer) {
      const photographerModel = photographerHeaderTemplate(photographer);
      const photographerDOM = photographerModel.getPhotoDOM();
      photographerSection.appendChild(photographerDOM);
    } else {
      console.error("Photographe introuvable avec l'ID fourni !");
    }

    console.log(photographer);

    const main = document.querySelector("main");

    // Ajout du menu de tri dynamique
    let sortMenu = document.querySelector('.sort-menu');
    if (!sortMenu) {
        sortMenu = document.createElement('div');
        sortMenu.className = 'sort-menu';
        sortMenu.innerHTML = `
            <label for="sort-select">Trier par :</label>
            <select id="sort-select">
                <option value="popularity">Popularité</option>
                <option value="date">Date</option>
                <option value="title">Titre</option>
            </select>
            <label for="sort-order">Ordre :</label>
            <select id="sort-order">
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
            </select>
        `;
        main.appendChild(sortMenu);
    }

    // Création/vidage de la section médias
    let mediaSection = document.querySelector(".media-section");
    if (mediaSection) {
        mediaSection.innerHTML = "";
    } else {
        mediaSection = document.createElement("section");
        mediaSection.setAttribute("class", "media-section");
        main.appendChild(mediaSection);
    }

    // Filtrer les médias correspondant à l'ID du photographe
    const filteredMedia = media.filter(
        (item) => item.photographerId === parseInt(id)
    );
    let currentMediaIndex = 0;

    // Fonction d'affichage des médias triés
    function displayMedia(sortedMedia) {
        mediaSection.innerHTML = "";
        sortedMedia.forEach((media) => {
            const mediaModel = mediaTemplate(media, photographers);
            const mediaCardDOM = mediaModel.getMedia();
            mediaSection.appendChild(mediaCardDOM);
        });

        // Réattacher les événements de lightbox
        document
            .querySelectorAll(".media-card img, .media-card video")
            .forEach((el, idx) => {
                el.addEventListener("click", () => openLightbox(idx));
            });

        // Réinitialiser le compteur de likes total
        const countLikes = document.querySelectorAll(".media-likes-number");
        let totalLike = Array.from(countLikes).reduce(
            (sum, el) => sum + parseInt(el.textContent, 10),
            0
        );
        let total = document.querySelector("#total-likes-value");
        total.textContent = `${totalLike}`;

        // Réattacher la gestion des likes
        const likeButtons = document.querySelectorAll(".like-button");
        likeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const heartIcon = event.currentTarget.querySelector("i");
                const likesNumberElement = event.currentTarget.parentNode.querySelector(
                    ".media-likes-number"
                );
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
    }

    // Fonction pour ouvrir la lightbox (à placer avant displayMedia)
    function openLightbox(index) {
        const lightbox = document.getElementById("lightbox");
        const lightboxContent = document.getElementById("lightbox-content");
        lightboxContent.innerHTML = "";

        const mediaItem = currentSortedMedia[index];
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

    // Variable pour garder la liste courante triée
    let currentSortedMedia = sortMedia(filteredMedia, "popularity");
    displayMedia(currentSortedMedia);

    // Navigation lightbox
    document.getElementById("lightbox-prev").onclick = function () {
        currentMediaIndex =
            (currentMediaIndex - 1 + currentSortedMedia.length) % currentSortedMedia.length;
        openLightbox(currentMediaIndex);
    };
    document.getElementById("lightbox-next").onclick = function () {
        currentMediaIndex = (currentMediaIndex + 1) % currentSortedMedia.length;
        openLightbox(currentMediaIndex);
    };
    document.getElementById("lightbox-close").onclick = function () {
        document.getElementById("lightbox").style.display = "none";
    };

    // Gestion du tri dynamique
    document.getElementById("sort-select").addEventListener("change", function () {
        currentSortedMedia = sortMedia(filteredMedia, this.value, document.getElementById("sort-order").value);
        displayMedia(currentSortedMedia);
    });
    document.getElementById("sort-order").addEventListener("change", function () {
        currentSortedMedia = sortMedia(filteredMedia, document.getElementById("sort-select").value, this.value);
        displayMedia(currentSortedMedia);
    });
  } else {
    console.error("Aucun photographe ou média trouvé !");
  }
}
init();
