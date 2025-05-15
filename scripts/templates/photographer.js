export default function photographerTemplate(data) {
    const { id, name, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const link= document.createElement( 'a' );
        link.setAttribute("href", `photographer.html?id=${id}`);
        link.setAttribute("aria-label", `Acceder à la page de ${name}`);
        article.appendChild(link);
        const img = document.createElement( 'img' );

        const descriptionContainer= document.createElement( 'div' );
        descriptionContainer.classList.add('description-container');
        article.appendChild(descriptionContainer);

        const countryCity = document.createElement( 'p' );
        countryCity.textContent = `${data.city}, ${data.country}`;
        countryCity.classList.add('country-city');
        descriptionContainer.appendChild(countryCity);

        const tagline = document.createElement('p');
        tagline.textContent = `${data.tagline}`;
        tagline.classList.add('tagline');
        descriptionContainer.appendChild(tagline);

        const price = document.createElement( 'p' );
        price.textContent = `${data.price}€/jour`;
        price.classList.add('price');
        descriptionContainer.appendChild(price);

        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        link.appendChild(img)
        img.setAttribute("alt", `Image de ${name}`);
        img.setAttribute("aria-label", `Acceder à la page de ${name}`);
        link.appendChild(h2);
        return (article);
    }
    
    return {picture, getUserCardDOM};
    
}