export default function mediaTemplate(media,photographers) {
    const { id, name, portrait } = photographers.find(photographer => photographer.id === media.photographerId);
    const { date, likes, price , image, video, title} = media;

    const picture = `assets/photographers/${portrait}`;


    function getMedia() {
        const imageContainer = document.createElement( 'article' );
        imageContainer.setAttribute("class", "media-card");
        imageContainer.setAttribute("aria-label", `Image de ${name}`);


        const media = document.createElement( 'div' );
        media.setAttribute("class", "media");
        let mediaElement;
        if (image){
        mediaElement = document.createElement( 'img' );
        mediaElement.setAttribute("src", `assets/sample_photos/${name}/${image}`)
        mediaElement.setAttribute("alt", `Image de ${name}`);
        mediaElement.setAttribute("aria-label", `photo de ${name}`);  
    }else{
      mediaElement = document.createElement('video');
        mediaElement.setAttribute("src", `assets/sample_photos/${name}/${video}`)
        
    }
media.appendChild(imageContainer);
imageContainer.appendChild(mediaElement)  
    
        


        const div = document.createElement( 'div' );
        div.setAttribute("class", "media-infos");
        media.appendChild(div);
        const nameMedia = document.createElement( 'p' );
        nameMedia.textContent = title;
        nameMedia.setAttribute("class", "media-title");
        div.appendChild(nameMedia);
        const likesMedia = document.createElement( 'p' );
        likesMedia.textContent = likes;
        likesMedia.setAttribute("class", "media-likes");
        div.appendChild(likesMedia);
        const heart = document.createElement('button');
        heart.setAttribute("class", "like-button");
        heart.setAttribute("aria-label", "Ajouter un like");
        const heartIcon = document.createElement('i');
        heartIcon.setAttribute("class", "fa-solid fa-heart");
        heart.appendChild(heartIcon);
        div.appendChild(heart);
        
    
        
       
        
        return (media);
    }
    
    return {picture, getMedia};
    
}