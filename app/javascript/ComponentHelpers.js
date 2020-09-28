import React, { Fragment } from 'react'
import RecipeDisplay from './components/RecipeDisplay'

export function embedYoutubeVideo (youtubeVideoId/*, iframeWidth = 320, iframeHeight = 240*/) {
    // [NOTE] Prior code is preserved in comments here. Remove/re-add after testing its further use
    return (
        <iframe 
            /*width={iframeWidth}
            height={iframeHeight}*/
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