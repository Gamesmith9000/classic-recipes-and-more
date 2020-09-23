import React, { Fragment } from 'react'
import axios from 'axios'
import RecipeDisplay from './components/RecipeDisplay'

export function getDataAndRenderRecipeDisplay (recipeId) {
   if(!recipeId) {
       return <Fragment />
   }

    axios.get(`/api/v1/recipes/${recipeId}`, { 
        params: {
            id: recipeId
        }
    })
    .then(res => {
        const { ingredients, paragraphs, title } = res.data.data.attributes;

        return (
            <RecipeDisplay
                ingredients={ingredients}
                paragraphs={paragraphs}
                title={title}
            />
        );
    })
    .catch(err => {
        console.log(err);
        return <Fragment />
    });
}
