export default function photographerTemplate(data) {
    const { name, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img)
        img.setAttribute("alt", `Image de ${name}`);
        img.setAttribute("aria-label", `Acceder à la page de ${name}`);
        article.appendChild(h2);
        return (article);
    }
    return { name, picture, getUserCardDOM }
}