export default function photographerHeaderTemplate(data) {
    // Déstructure les propriétés du photographe depuis l'objet data
    const { name, portrait, city, country, tagline } = data;
    // Construit le chemin de l'image du portrait
    const picture = `assets/photographers/${portrait}`;

    // Fonction qui construit et retourne le DOM de l'en-tête du photographe
    function getPhotoDOM() {
        // Crée l'élément principal de la carte photographe
        const article = document.createElement('article');
        article.className = "photograph-card";
        article.tabIndex = 0; // Rendre focusable au clavier

        // Ajoute la photo du photographe
        const img = document.createElement('img');
        img.src = picture;
        img.alt = `Portrait de ${name}`;
        article.appendChild(img);

        // Crée le bouton de contact
        const button = document.createElement('button');
        button.className = "contact_button";
        button.ariaLabel = `Contactez ${name}`; // Accessibilité
        button.textContent = "Contactez-moi";
        button.onclick = () => {
        // Ouvre la modale de contact
        document.querySelector("#contact-modal").style.transform = "translateX(0%)";
        };
        article.appendChild(button);

        // Crée le conteneur pour les informations du photographe
        const infoDiv = document.createElement('div');
        infoDiv.className = "photographer-information";
        article.appendChild(infoDiv);

        // Ajoute le nom du photographe
        const h2 = document.createElement('h2');
        h2.textContent = name;
        infoDiv.appendChild(h2);

        // Ajoute la localisation (ville, pays)
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        infoDiv.appendChild(location);

        // Ajoute la tagline du photographe
        const taglinePhotographer = document.createElement('p');
        taglinePhotographer.textContent = tagline;
        infoDiv.appendChild(taglinePhotographer);

        // Retourne l'élément DOM complet
        return article;
    }

    // Retourne le chemin du portrait et la fonction de création du DOM
    return { picture, getPhotoDOM };
}