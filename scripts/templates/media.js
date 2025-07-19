export default function mediaTemplate(media, photographers) {
  // Récupère le nom et le portrait du photographe associé à ce média
  const { name, portrait } = photographers.find(
    (photographer) => photographer.id === media.photographerId
  );
  // Déstructure les propriétés du média
  const { likes, image, video, title } = media;
  // Chemin vers le portrait du photographe
  const picture = `assets/photographers/${portrait}`;

  // Fonction qui construit et retourne le DOM du média
  function getMedia() {
    // Crée l'article principal pour la carte média
    const imageContainer = document.createElement("article");
    imageContainer.setAttribute("class", "media-card");
    imageContainer.setAttribute("aria-label", `Image de ${name}`);

    // Crée un conteneur pour l'image ou la vidéo
    const media = document.createElement("div");
    media.setAttribute("class", "media");
    media.setAttribute("tabindex", "0"); // Rendre focusable au clavier

    let mediaElement;
    if (image) {
      // Si c'est une image
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("src", `assets/sample_photos/${name}/${image}`);
      mediaElement.setAttribute("alt", `Image de ${name}`);
      mediaElement.setAttribute("aria-label", `photo de ${name}`);
    } else {
      // Sinon, c'est une vidéo
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("controls", "");
      mediaElement.setAttribute("aria-label", `video de ${name}`);
      mediaElement.setAttribute("autoplay", "");
      mediaElement.setAttribute("muted", "");
      mediaElement.setAttribute("src", `assets/sample_photos/${name}/${video}`);
    }

    // Structure DOM : media > imageContainer > mediaElement
    media.appendChild(imageContainer);
    imageContainer.appendChild(mediaElement);

    // Crée la zone d'infos sous le média (titre + likes)
    const infosMedia = document.createElement("div");
    infosMedia.setAttribute("class", "media-infos");
    media.appendChild(infosMedia);

    // Ajoute le titre du média
    const nameMedia = document.createElement("p");
    nameMedia.textContent = title;
    nameMedia.setAttribute("class", "media-title");
    infosMedia.appendChild(nameMedia);

    // Crée la zone des likes
    const likeMedia = document.createElement("div");
    likeMedia.setAttribute("class", "media-likes");
    infosMedia.appendChild(likeMedia);

    // Affiche le nombre de likes
    const likesMediaNumber = document.createElement("p");
    likesMediaNumber.textContent = likes;
    likesMediaNumber.setAttribute("class", "media-likes-number");
    likeMedia.appendChild(likesMediaNumber);

    // Bouton coeur pour liker
    const heart = document.createElement("button");
    heart.setAttribute("class", "like-button");
    heart.setAttribute("aria-label", "Ajouter un like");
    const heartIcon = document.createElement("i");
    heartIcon.setAttribute("class", "fa-regular fa-heart");
    heart.appendChild(heartIcon);
    likeMedia.appendChild(heart);

    // Ferme la lightbox au clic sur la croix
    document.getElementById("lightbox-close").onclick = function () {
      document.getElementById("lightbox").style.display = "none";
    };

    // Retourne le conteneur principal du média
    return media;
  }

  // Retourne le chemin du portrait et la fonction de création du DOM
  return { picture, getMedia };
}
