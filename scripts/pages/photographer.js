import mediaTemplate from "../templates/media.js";
import photographerHeaderTemplate from "../templates/photographerHeader.js";

// Variables globales pour le tri
window.lastCriterion = "popularity";
window.sortOrder = "desc";

async function getPhotographersAndMedia() {
  try {
    const response = await fetch("../data/photographers.json");
    const data = await response.json();
    const { photographers, media } = data;
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
  if (order === "asc") sorted.reverse();
  return sorted;
}

async function init() {
  const { photographers, media } = await getPhotographersAndMedia();
  const id = new URLSearchParams(window.location.search).get("id");

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

    const contactButton = document.querySelector(".contact_button");
    if (contactButton) {
      contactButton.addEventListener("click", () => {
        const formTitle = document.querySelector(".form-title");
        if (formTitle && !formTitle.querySelector(".modal-header-text")) {
          const newDiv = document.createElement("div");
          newDiv.classList.add("modal-header-text");
          const h2 = document.createElement("h2");
          h2.textContent = "Contactez-moi";
          const p = document.createElement("p");
          p.textContent = photographer.name;
          newDiv.appendChild(h2);
          newDiv.appendChild(p);
          formTitle.appendChild(newDiv);
        }
      });
    }

    const main = document.querySelector("main");
    let mediaSection = document.querySelector(".media-section");
    if (mediaSection) {
      mediaSection.innerHTML = "";
    } else {
      mediaSection = document.createElement("section");
      mediaSection.setAttribute("class", "media-section");
      main.appendChild(mediaSection);
    }

    const filteredMedia = media.filter(
      (item) => item.photographerId === parseInt(id)
    );
    let currentMediaIndex = 0;

    function displayMedia(sortedMedia) {
      mediaSection.innerHTML = "";
      sortedMedia.forEach((media, idx) => {
        const mediaModel = mediaTemplate(media, photographers);
        const mediaCardDOM = mediaModel.getMedia();
        mediaSection.appendChild(mediaCardDOM);

        mediaCardDOM.setAttribute('tabindex', '0');

        // Ouvre la lightbox au clavier (Entrée/Espace)
        mediaCardDOM.addEventListener('keydown', function(e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(idx);
          }
        });

        // Ouvre la lightbox au clic sur la carte, sauf si clic sur .media-infos
        mediaCardDOM.addEventListener('click', function(e) {
          // Vérifie si le clic vient de .media-infos ou de ses enfants
          if (e.target.closest('.media-infos')) return;
          openLightbox(idx);
        });
      });

      const countLikes = document.querySelectorAll(".media-likes-number");
      let totalLike = Array.from(countLikes).reduce(
        (sum, el) => sum + parseInt(el.textContent, 10),
        0
      );
      let total = document.querySelector("#total-likes-value");
      total.textContent = `${totalLike}`;
      let priceperDay = document.querySelector("#price-per-day");
      priceperDay.textContent = `${photographer.price}€/jour`;

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

      document.addEventListener("keydown", function handleLightboxKeys(e) {
        const lightbox = document.getElementById("lightbox");
        if (lightbox.style.display === "flex") {
          if (e.key === "ArrowLeft") {
            currentMediaIndex =
              (currentMediaIndex - 1 + filteredMedia.length) % filteredMedia.length;
            openLightbox(currentMediaIndex);
          }
          if (e.key === "ArrowRight") {
            currentMediaIndex = (currentMediaIndex + 1) % filteredMedia.length;
            openLightbox(currentMediaIndex);
          }
          if (e.key === "Escape") {
            lightbox.style.display = "none";
          }
        }
      });
    }

    displayMedia(filteredMedia);

    document.getElementById("lightbox-prev").onclick = function () {
      currentMediaIndex =
        (currentMediaIndex - 1 + filteredMedia.length) % filteredMedia.length;
      openLightbox(currentMediaIndex);
    };
    document.getElementById("lightbox-next").onclick = function () {
      currentMediaIndex = (currentMediaIndex + 1) % filteredMedia.length;
      openLightbox(currentMediaIndex);
    };
    document.getElementById("lightbox-close").onclick = function () {
      document.getElementById("lightbox").style.display = "none";
    };

    // Rends ces variables accessibles globalement pour le menu
    window.filteredMedia = filteredMedia;
    window.displayMedia = displayMedia;
  } else {
    console.error("Aucun photographe ou média trouvé !");
  }
}

init();

// Dropdown menu listeners (à placer après init pour garantir l'accès aux variables)
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("dropdown-menu");

  // Ajoute tabindex="0" à tous les li du menu (si tu veux tous focusables)
  menu.querySelectorAll('li').forEach(li => {
    li.setAttribute('tabindex', '0');
    // Activation clavier
    li.addEventListener('keydown', function(e) {
      const allLis = Array.from(menu.querySelectorAll('li'));
      const currentIndex = allLis.indexOf(document.activeElement);

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click(); // Simule le clic pour déclencher le tri
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let next = (currentIndex + 1) % allLis.length;
        allLis[next].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        let prev = (currentIndex - 1 + allLis.length) % allLis.length;
        allLis[prev].focus();
      }
    });
  }); 

  function updateSortArrow() {
    menu.querySelectorAll('.sort-arrow').forEach(span => span.remove());
    const firstLi = menu.querySelector('li');
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'sort-arrow';
    arrowSpan.innerHTML = window.sortOrder === "asc"
      ? '<i class="fa-solid fa-chevron-up"></i>'
      : '<i class="fa-solid fa-chevron-down"></i>';
    firstLi.appendChild(arrowSpan);
  }

  function setMainItemListener() {
    const firstLi = menu.querySelector("li");
    const newFirstLi = firstLi.cloneNode(true);
    firstLi.parentNode.replaceChild(newFirstLi, firstLi);

    // Ajoute l'écouteur clavier ici aussi !
    newFirstLi.setAttribute('tabindex', '0');
    newFirstLi.addEventListener('keydown', function(e) {
      const allLis = Array.from(menu.querySelectorAll('li'));
      const currentIndex = allLis.indexOf(document.activeElement);

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        newFirstLi.click();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let next = (currentIndex + 1) % allLis.length;
        allLis[next].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        let prev = (currentIndex - 1 + allLis.length) % allLis.length;
        allLis[prev].focus();
      }
    });

    newFirstLi.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("open")) {
        window.sortOrder = window.sortOrder === "asc" ? "desc" : "asc";
        const criterion = newFirstLi.dataset.value;
        if (typeof window.filteredMedia !== "undefined" && typeof window.displayMedia === "function") {
          const sorted = sortMedia(window.filteredMedia, criterion, window.sortOrder);
          window.displayMedia(sorted);
        }
        updateSortArrow();
        menu.classList.remove("open");
      } else {
        menu.classList.add("open");
      }
    });
    updateSortArrow();
  }

  function setOtherItemsListeners() {
    const items = Array.from(menu.querySelectorAll("li")).slice(1);
    items.forEach(item => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      // Ajoute l'écouteur clavier ici aussi !
      newItem.setAttribute('tabindex', '0');
      newItem.addEventListener('keydown', function(e) {
        const allLis = Array.from(menu.querySelectorAll('li'));
        const currentIndex = allLis.indexOf(document.activeElement);

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          newItem.click();
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          let next = (currentIndex + 1) % allLis.length;
          allLis[next].focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          let prev = (currentIndex - 1 + allLis.length) % allLis.length;
          allLis[prev].focus();
        }
      });

      newItem.addEventListener("click", function(e) {
        e.stopPropagation();
        menu.classList.remove("open");
        menu.insertBefore(this, menu.firstChild);
        setMainItemListener();
        setOtherItemsListeners();

        const criterion = this.dataset.value;
        if (!window.lastCriterion) window.lastCriterion = "popularity";
        if (!window.sortOrder) window.sortOrder = "desc";
        if (window.lastCriterion === criterion) {
          window.sortOrder = window.sortOrder === "asc" ? "desc" : "asc";
        } else {
          window.sortOrder = "desc";
        }
        window.lastCriterion = criterion;

        if (typeof window.filteredMedia !== "undefined" && typeof window.displayMedia === "function") {
          const sorted = sortMedia(window.filteredMedia, criterion, window.sortOrder);
          window.displayMedia(sorted);
        }
        updateSortArrow();
      });
    });
  }

  setMainItemListener();
  setOtherItemsListeners();

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("open");
    }
  });

  updateSortArrow();
});


