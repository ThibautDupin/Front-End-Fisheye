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

        const city = document.createElement( 'p' );
        city.textContent = city;
        const country = document.createElement( 'p' );
        country.textContent = country;
        const price = document.createElement( 'p' );
        price.textContent = `${price}€/jour`;


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