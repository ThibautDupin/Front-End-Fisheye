export default function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        // Crée l'ancre parent
        const link = document.createElement('a');
        link.href = `photographer.html?id=${id}`;
        link.setAttribute("aria-label", `Accéder à la page de ${name}`);
        link.style.textDecoration = "none"; // Optionnel : retire le soulignement

        // Crée l'article à l'intérieur de l'ancre
        const article = document.createElement('article');

        // Image
        const img = document.createElement('img');
        img.src = picture;
        img.alt = `Portrait de ${name}`;
        article.appendChild(img);

        // Nom
        const h2 = document.createElement('h2');
        h2.textContent = name;
        article.appendChild(h2);

        // Description
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        const countryCity = document.createElement('p');
        countryCity.className = 'country-city';
        countryCity.textContent = `${city}, ${country}`;
        descriptionContainer.appendChild(countryCity);

        const taglineP = document.createElement('p');
        taglineP.className = 'tagline';
        taglineP.textContent = tagline;
        descriptionContainer.appendChild(taglineP);

        const priceP = document.createElement('p');
        priceP.className = 'price';
        priceP.textContent = `${price}€/jour`;
        descriptionContainer.appendChild(priceP);

        article.appendChild(descriptionContainer);

        // Place l'article dans l'ancre
        link.appendChild(article);

        return link;
    }

    return { picture, getUserCardDOM };
}