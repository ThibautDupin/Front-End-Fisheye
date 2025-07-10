export default function photographerHeaderTemplate(data) {
    const { name, portrait, city, country, tagline } = data;
    const picture = `assets/photographers/${portrait}`;

    function getPhotoDOM() {
        const article = document.createElement('article');
        article.className = "photograph-card";
        article.tabIndex = 0;

        const img = document.createElement('img');
        img.src = picture;
        img.alt = `Portrait de ${name}`;
        article.appendChild(img);

        const button = document.createElement('button');
        button.className = "contact_button";
        button.ariaLabel = `Contactez ${name}`;
        button.textContent = "Contactez-moi";
        button.onclick = () => {
            document.querySelector("#contact-modal").style.transform = "translateX(0%)";
        };
        article.appendChild(button);

        const infoDiv = document.createElement('div');
        infoDiv.className = "photographer-information";
        article.appendChild(infoDiv);

        const h2 = document.createElement('h2');
        h2.textContent = name;
        infoDiv.appendChild(h2);

        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        infoDiv.appendChild(location);

        const taglinePhotographer = document.createElement('p');
        taglinePhotographer.textContent = tagline;
        infoDiv.appendChild(taglinePhotographer);

        return article;
    }

    return { picture, getPhotoDOM };
}