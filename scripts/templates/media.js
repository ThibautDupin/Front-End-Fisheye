export default function mediaTemplate(media, photographers) {
  const { id, name, portrait } = photographers.find(
    (photographer) => photographer.id === media.photographerId
  );
  const { date, likes, price, image, video, title } = media;

  const picture = `assets/photographers/${portrait}`;

  function getMedia() {
    const imageContainer = document.createElement("article");
    imageContainer.setAttribute("class", "media-card");
    imageContainer.setAttribute("aria-label", `Image de ${name}`);

    const media = document.createElement("div");
    media.setAttribute("class", "media");
    let mediaElement;
    if (image) {
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("src", `assets/sample_photos/${name}/${image}`);
      mediaElement.setAttribute("alt", `Image de ${name}`);
      mediaElement.setAttribute("aria-label", `photo de ${name}`);
    } else {
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("controls", "");
      mediaElement.setAttribute("aria-label", `video de ${name}`);
      mediaElement.setAttribute("autoplay", "");
      mediaElement.setAttribute("muted", "");
      mediaElement.setAttribute("src", `assets/sample_photos/${name}/${video}`);
    }
    media.appendChild(imageContainer);
    imageContainer.appendChild(mediaElement);

    const infosMedia = document.createElement("div");
    infosMedia.setAttribute("class", "media-infos");
    media.appendChild(infosMedia);
    const nameMedia = document.createElement("p");
    nameMedia.textContent = title;
    nameMedia.setAttribute("class", "media-title");
    infosMedia.appendChild(nameMedia);
    const likeMedia = document.createElement("div");
    likeMedia.setAttribute("class", "media-likes");
    infosMedia.appendChild(likeMedia);

// Likes count + incrementation

    const likesMediaNumber = document.createElement("p");
    likesMediaNumber.textContent = likes;
    likesMediaNumber.setAttribute("class", "media-likes-number");
    likeMedia.appendChild(likesMediaNumber);
    const heart = document.createElement("button");
    heart.setAttribute("class", "like-button");
    heart.setAttribute("aria-label", "Ajouter un like");
    const heartIcon = document.createElement("i");
    heartIcon.setAttribute("class", "fa-regular fa-heart");
    heart.appendChild(heartIcon);
    likeMedia.appendChild(heart);

    // Ajoute l'ouverture de la lightbox au clic sur le média
    mediaElement.style.cursor = "pointer";
    mediaElement.addEventListener("click", function () {
      const lightbox = document.getElementById("lightbox");
      const lightboxContent = document.getElementById("lightbox-content");
      lightboxContent.innerHTML = ""; // Vide le contenu précédent

      let clone;
      if (mediaElement.tagName === "IMG") {
        clone = document.createElement("img");
        clone.src = mediaElement.src;
        clone.alt = mediaElement.alt;
      } else if (mediaElement.tagName === "VIDEO") {
        clone = document.createElement("video");
        clone.src = mediaElement.src;
        clone.setAttribute("controls", "");
        clone.setAttribute("autoplay", "");
        clone.setAttribute("muted", "");
      }
      lightboxContent.appendChild(clone);
      lightbox.style.display = "flex";
    });

    // Fermer la lightbox au clic sur la croix
    document.getElementById("lightbox-close").onclick = function () {
      document.getElementById("lightbox").style.display = "none";
    };

    return media;
  }


  return { picture, getMedia };
}
