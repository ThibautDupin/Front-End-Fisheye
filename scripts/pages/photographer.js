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

// Variables pour mémoriser le tri
let lastSortcategory = "popularity";
let lastSortOrder = "asc";

// Fonction de tri (déjà présente)
function sortMedia(mediaArray, category, order = "asc") {
    let sorted;
    switch (category) {
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
    if (order === "desc") {
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
        sortMenu.innerHTML = 
        `
        <div class="custom-dropdown">
          <div class="dropdown-toggle">Trier par : <span id="selected-sort">Popularité</span> <i class="fa-solid fa-chevron-down"></i></div>
          <ul class="dropdown-list">
              <li class="category" value="popularity">Popularité</li>
              <li class="category" value="date">Date</li>
              <li class="category" value="title">Titre</li>
          </ul>
        </div>
        <span id="sort-order-indicator"></span>
        `;

        // Ajout des écouteurs de clic pour chaque catégorie de tri
        sortMenu.querySelectorAll('.category').forEach(li => {
            li.addEventListener('click', function () {
            const critereTri = this.getAttribute('value');
            if (critereTri === lastSortcategory) {
                lastSortOrder = lastSortOrder === "asc" ? "desc" : "asc";
            } else {
                lastSortOrder = "asc"; 
            }
            lastSortcategory = critereTri;
            currentSortedMedia = sortMedia(filteredMedia, critereTri, lastSortOrder);
            displayMedia(currentSortedMedia);
            updateSortOrderIndicator();
            });
        });
        // `
        //     <label for="sort-select">Trier par :</label>
        //     <select id="sort-select">
        //         <option value="popularity">Popularité</option>
        //         <option value="date">Date</option>
        //         <option value="title">Titre</option>
        //     </select>
        //     <span id="sort-order-indicator"></span>
        // `;
        main.appendChild(sortMenu);
    } else {
        // Ajoute la span juste après le select si elle n'existe pas déjà
        const select = sortMenu.querySelector('#sort-select');
        if (select && !sortMenu.querySelector('#sort-order-indicator')) {
            const span = document.createElement('span');
            span.id = 'sort-order-indicator';
            span.style.marginLeft = "8px";
            select.insertAdjacentElement('afterend', span);
        }
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
        let priceperDay = document.querySelector("#price-per-day");
        priceperDay.textContent = `${photographer.price}€/jour`;

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
    let currentSortedMedia = sortMedia(filteredMedia, "popularity", "asc");
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


    // Fonction utilitaire pour mettre à jour l'affichage de l'ordre
    function updateSortOrderIndicator() {
        sortOrderIndicator.textContent = lastSortOrder === "asc" ? "asc" : "desc";
    }


    // Affichage initial
    currentSortedMedia = sortMedia(filteredMedia, "popularity", "asc");
    displayMedia(currentSortedMedia);
    updateSortOrderIndicator();
  } else {
    console.error("Aucun photographe ou média trouvé !");
  }
}
init();

// JavaScript
const dropdown = document.querySelector('.custom-dropdown');
const toggle = dropdown.querySelector('.dropdown-toggle');
const list = dropdown.querySelector('.dropdown-list');
const selected = dropdown.querySelector('#selected-sort');

toggle.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

list.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', function() {
    selected.textContent = this.textContent;
    dropdown.classList.remove('open');
    // Ici tu peux lancer ton tri avec this.dataset.value
  });
});

// Fermer le menu si clic en dehors
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});
