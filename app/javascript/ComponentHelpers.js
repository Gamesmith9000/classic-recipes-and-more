import React, { Fragment } from 'react'
import { mapSectionsDataFromAxiosResponse } from './Helpers'

import PageManager from './components/ContentManagement/Managers/PageManager'
import PhotoManager from './components/ContentManagement/Managers/PageManager'
import RecipeDisplay from './components/RecipeDisplay'
import RecipeManager from './components/ContentManagement/Managers/RecipeManager'


export const ContentSectionsInfo = {
    isValidSectionId: function (sectionId) {
        if(!Number.isInteger(newSectionIdentifier) || newSectionIdentifier < 0 || newSectionIdentifier > sectionId.length -1) {
            return false
        }
        else { return true; }
    },
    sections: [
        {component: <PageManager/>, name: 'Pages' },
        {component: <RecipeManager/>, name: 'Recipes' },
        {component: <PhotoManager/>, name: 'Photos' }
    ]
}

export function embedYoutubeVideo (youtubeVideoId) {
    return (
        <iframe 
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

    const { ingredients, paragraphs, title } = responseData.data.data.attributes;
    const sections = mapSectionsDataFromAxiosResponse(responseData);
    
    return(
        <RecipeDisplay
        ingredients={ingredients}
        paragraphs={paragraphs}
        sections={sections}
        title={title}
        />
    );
}

export function unsavedChangesMessage (hasUnsavedChanges) {
    return (
        // [NOTE] a more pleasant display should be created
        <Fragment>     
            {hasUnsavedChanges === true ?
                <p>YOU HAVE UNSAVED CHANGES!</p>
            :
                <br/>
            }
        </Fragment>
    );
}