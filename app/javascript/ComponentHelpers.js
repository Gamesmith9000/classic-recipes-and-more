import React, { Fragment } from 'react'
import axios from 'axios'
import RecipeDisplay from './components/RecipeDisplay'

export function embedYoutubeVideo (youtubeVideoId) {
    return (
        <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
        </iframe>
    );
}

export function renderRecipeDisplayFromResponse(responseData){
    if(!responseData?.data?.data) {
        return <Fragment />
    }

    const { ingredients, paragraphs, photoId, title } = responseData.data.data.attributes;
    return(
        <RecipeDisplay
        ingredients={ingredients}
        paragraphs={paragraphs}
        photoId={photoId}
        title={title}
        />
    );
}