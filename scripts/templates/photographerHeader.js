export default function photographerHeaderTemplate(data) {


    const { id, name, portrait, city, country,tagline } = data

    const picture = `assets/photographers/${portrait}`;

    function getPhotoDOM() {
        // Créer un nouvel élément article
        const article = document.createElement('article');
        article.setAttribute("class", "photograph-card");
    
        // Ajouter l'image du photographe
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Portrait de ${name}`);
        article.appendChild(img);
        const button = document.createElement('button');
        button.setAttribute("aria-label", `Contactez ${name}`);
        button.setAttribute("class", "contact_button");
        button.textContent = "Contactez-moi";
        button.setAttribute.onclick = displayModal();
        article.appendChild(button);
    
        // Ajouter les informations du photographe
        const div = document.createElement('div');
        div.setAttribute("class", "photographer-information");
        article.appendChild(div);
        // Ajouter le nom du photographe
        const h2 = document.createElement('h2');
        h2.textContent = name;
        div.appendChild(h2);
        // Ajouter la localisation
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        div.appendChild(location);
    
        // Ajouter la tagline
        const taglinePhotographer = document.createElement('p');
        taglinePhotographer.textContent = tagline;
        div.appendChild(taglinePhotographer);
    
        return article; // Retourner le nouvel élément
    }
    
    return {picture, getPhotoDOM};
    
}