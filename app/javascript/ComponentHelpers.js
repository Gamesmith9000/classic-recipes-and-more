import React from 'react'
import RecipeDisplay from './components/RecipeDisplay'

export function getDataAndRenderRecipeDisplay (recipeId) {
    /*  (1) Get recipe data with axios
        (2) Save the data
        (3) Pass data into RecipeDisplay as props
        (4) (and return RecipeDisplay)

        // Start with title
    */

    return (
        <RecipeDisplay 
            title="Title Placeholder"
        />
    );
}
