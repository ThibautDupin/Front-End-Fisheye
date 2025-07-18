import mediaTemplate from "../templates/media.js";
import photographerHeaderTemplate from "../templates/photographerHeader.js";

// Tri par défaut pour les médias
window.lastCriterion = "popularity";
window.sortOrder = "desc";

// Récupère les données JSON des photographes et médias
async function getPhotographersAndMedia() {
  try {
    const response = await fetch("../data/photographers.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return { photographers: [], media: [] };
  }
}

// Trie les médias selon le critère choisi
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

// Affiche tous les médias du photographe sur la page
function displayMedia(sortedMedia, photographers, photographer, openLightbox) {
  const mediaSection = document.querySelector(".media-section");
  mediaSection.innerHTML = "";
  sortedMedia.forEach((media, idx) => {
    const mediaModel = mediaTemplate(media, photographers);
    const mediaCardDOM = mediaModel.getMedia();
    mediaSection.appendChild(mediaCardDOM);

    // Rendre chaque media-card focusable au clavier
    mediaCardDOM.setAttribute('tabindex', '0');

    // Ouvre la lightbox au clavier (Entrée/Espace)
    mediaCardDOM.addEventListener('keydown', e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });

    // Ouvre la lightbox au clic sur la carte, sauf si clic sur .media-infos
    mediaCardDOM.addEventListener('click', e => {
      if (e.target.closest('.media-infos')) return;
      openLightbox(idx);
    });
  });

  // Calcule et affiche le total des likes
  const countLikes = document.querySelectorAll(".media-likes-number");
  let totalLike = Array.from(countLikes).reduce(
    (sum, el) => sum + parseInt(el.textContent, 10), 0
  );
  document.querySelector("#total-likes-value").textContent = `${totalLike}`;
  document.querySelector("#price-per-day").textContent = `${photographer.price}€/jour`;

  // Gestion des likes (clic et clavier)
  document.querySelectorAll(".like-button").forEach(button => {
    // Clic souris
    button.addEventListener("click", handleLike);

    // Accessibilité clavier (Entrée/Espace)
    button.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation(); // Empêche l'ouverture de la lightbox
        handleLike.call(button, event);
      }
    });
  });

  // Fonction pour incrémenter/décrémenter les likes
  function handleLike(event) {
    const heartIcon = this.querySelector("i");
    const likesNumberElement = this.parentNode.querySelector(".media-likes-number");
    let likesNumber = parseInt(likesNumberElement.textContent, 10);

    if (heartIcon.classList.contains("fa-solid")) {
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");
      likesNumber--;
      totalLike--;
    } else {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
      likesNumber++;
      totalLike++;
    }
    likesNumberElement.textContent = likesNumber;
    document.querySelector("#total-likes-value").textContent = `${totalLike}`;
  }
}

// Ouvre la lightbox avec le média sélectionné et gère la navigation
function openLightbox(index, filteredMedia, photographer) {
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  lightboxContent.innerHTML = "";

  // Ajoute l'image ou la vidéo dans la lightbox
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
  window.currentMediaIndex = index;

  // Navigation clavier dans la lightbox (flèches et échap)
  function handleLightboxKeys(e) {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowLeft") {
        window.currentMediaIndex = (window.currentMediaIndex - 1 + filteredMedia.length) % filteredMedia.length;
        openLightbox(window.currentMediaIndex, filteredMedia, photographer);
      }
      if (e.key === "ArrowRight") {
        window.currentMediaIndex = (window.currentMediaIndex + 1) % filteredMedia.length;
        openLightbox(window.currentMediaIndex, filteredMedia, photographer);
      }
      if (e.key === "Escape") {
        lightbox.style.display = "none";
        document.removeEventListener("keydown", handleLightboxKeys);
      }
    }
  }
  // Toujours un seul écouteur actif
  document.removeEventListener("keydown", handleLightboxKeys);
  document.addEventListener("keydown", handleLightboxKeys);
}

// Fonction principale d'initialisation de la page photographe
async function init() {
  const { photographers, media } = await getPhotographersAndMedia();
  const id = new URLSearchParams(window.location.search).get("id");
  if (!(photographers && photographers.length && media && media.length > 0)) {
    console.error("Aucun photographe ou média trouvé !");
    return;
  }

  // Sélectionne le photographe courant
  const photographerSection = document.querySelector(".photograph-header");
  const photographer = photographers.find(p => p.id === parseInt(id));
  if (!photographer) {
    console.error("Photographe introuvable avec l'ID fourni !");
    return;
  }

  // Affiche l'entête du photographe
  const photographerModel = photographerHeaderTemplate(photographer);
  photographerSection.appendChild(photographerModel.getPhotoDOM());

  // Gestion de la modale de contact
  const contactButton = document.querySelector(".contact_button");
  if (contactButton) {
    contactButton.addEventListener("click", () => {
      const formTitle = document.querySelector(".form-title");
      // Ajoute dynamiquement le nom du photographe dans la modale si besoin
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
      // Affiche la modale
      document.getElementById("contact-modal").style.display = "flex";
      // Met le focus sur le premier champ du formulaire pour l'accessibilité
      const firstInput = document.querySelector("#contact-modal input, #contact-modal textarea, #contact-modal button");
      if (firstInput) firstInput.focus();
    });
  }

  // Création ou réinitialisation de la section médias
  let mediaSection = document.querySelector(".media-section");
  if (!mediaSection) {
    mediaSection = document.createElement("section");
    mediaSection.className = "media-section";
    document.querySelector("main").appendChild(mediaSection);
  } else {
    mediaSection.innerHTML = "";
  }

  // Filtre les médias du photographe courant
  const filteredMedia = media.filter(item => item.photographerId === parseInt(id));
  window.filteredMedia = filteredMedia;
  // Fonction globale pour afficher les médias triés
  window.displayMedia = (sorted) => displayMedia(sorted, photographers, photographer, (idx) => openLightbox(idx, filteredMedia, photographer));

  // Gestion des boutons de navigation de la lightbox
  document.getElementById("lightbox-prev").onclick = function () {
    window.currentMediaIndex = (window.currentMediaIndex - 1 + filteredMedia.length) % filteredMedia.length;
    openLightbox(window.currentMediaIndex, filteredMedia, photographer);
  };
  document.getElementById("lightbox-next").onclick = function () {
    window.currentMediaIndex = (window.currentMediaIndex + 1) % filteredMedia.length;
    openLightbox(window.currentMediaIndex, filteredMedia, photographer);
  };
  document.getElementById("lightbox-close").onclick = function () {
    document.getElementById("lightbox").style.display = "none";
  };

  // Affichage initial des médias
  window.displayMedia(filteredMedia);
}

init();

// Gestion du menu déroulant de tri et accessibilité
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("dropdown-menu");

  // Met à jour la flèche de tri
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

  // Rend chaque élément de menu focusable et navigable au clavier
  function setLiAccessibility(li) {
    li.setAttribute('tabindex', '0');
    li.addEventListener('keydown', function(e) {
      const allLis = Array.from(menu.querySelectorAll('li'));
      const currentIndex = allLis.indexOf(document.activeElement);
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        allLis[(currentIndex + 1) % allLis.length].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        allLis[(currentIndex - 1 + allLis.length) % allLis.length].focus();
      }
    });
  }

  // Gère le comportement du premier élément du menu (critère principal)
  function setMainItemListener() {
    const firstLi = menu.querySelector("li");
    const newFirstLi = firstLi.cloneNode(true);
    firstLi.parentNode.replaceChild(newFirstLi, firstLi);
    setLiAccessibility(newFirstLi);

    newFirstLi.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("open")) {
        window.sortOrder = window.sortOrder === "asc" ? "desc" : "asc";
        const criterion = newFirstLi.dataset.value;
        if (window.filteredMedia && typeof window.displayMedia === "function") {
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

  // Gère le comportement des autres éléments du menu
  function setOtherItemsListeners() {
    const items = Array.from(menu.querySelectorAll("li")).slice(1);
    items.forEach(item => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      setLiAccessibility(newItem);

      newItem.addEventListener("click", function(e) {
        e.stopPropagation();
        menu.classList.remove("open");
        menu.insertBefore(this, menu.firstChild);
        setMainItemListener();
        setOtherItemsListeners();

        const criterion = this.dataset.value;
        if (window.lastCriterion === criterion) {
          window.sortOrder = window.sortOrder === "asc" ? "desc" : "asc";
        } else {
          window.sortOrder = "desc";
        }
        window.lastCriterion = criterion;

        if (window.filteredMedia && typeof window.displayMedia === "function") {
          const sorted = sortMedia(window.filteredMedia, criterion, window.sortOrder);
          window.displayMedia(sorted);
        }
        updateSortArrow();
      });
    });
  }

  // Initialisation du menu de tri
  menu.querySelectorAll('li').forEach(setLiAccessibility);
  setMainItemListener();
  setOtherItemsListeners();

  // Ferme le menu si clic en dehors
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) menu.classList.remove("open");
  });

  updateSortArrow();
});

// Gestion de la soumission du formulaire de contact
const contactForm = document.querySelector("#contact-modal form");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const prenom = contactForm.querySelector("#prenom")?.value;
    const nom = contactForm.querySelector("#nom")?.value;
    const email = contactForm.querySelector("#email")?.value;
    const commentaire = contactForm.querySelector("#commentaire")?.value;
    console.log("Prénom:", prenom);
    console.log("Nom:", nom);
    console.log("Email:", email);
    console.log("Commentaire:", commentaire);

    // Ferme la modale après soumission
    document.getElementById("contact-modal").style.display = "none";
  });
}

// Accessibilité : rend la croix de fermeture de la modale focusable et activable au clavier
document.addEventListener("DOMContentLoaded", () => {
  const closeModalSpan = document.querySelector('.close-modal');
  if (closeModalSpan) {
    closeModalSpan.setAttribute('tabindex', '0');
    closeModalSpan.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("contact-modal").style.display = "none";
      }
    });
  }

  // Accessibilité : rend l'en-tête du photographe focusable
  const header = document.querySelector('.photograph-header');
  if (header) {
    header.setAttribute('tabindex', '0');
  }
});


