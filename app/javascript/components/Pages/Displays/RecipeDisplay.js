import React from 'react'
import VersionedPhoto from '../../Misc/VersionedPhoto'

function RecipeDisplay (props) {
    const { allowUnfeatured, description, featured, ingredients, instructions, photo, photoVersion, previewPhotoUrl, title } = props;

    if(featured === false && allowUnfeatured !== true) { return null; }

    const mappedIngredients = () => {
        if(!ingredients) { return null; }
        const mappedItems = ingredients.map((element, index) => { return <li className="ingredient" key={index}>{element}</li> });
        return <ul className="ingredients">{mappedItems}</ul>;
    }

    const mappedInstructions = () => {
        if(!instructions) { return null; }
        const ordinalSort = (a,b) => { return a.ordinal - b.ordinal; }
        const mappedItems = instructions.sort(ordinalSort).map((element) => { return <li className="instruction" key={element.id}>{element.content}</li> });
        return <ul className="instructions">{mappedItems}</ul>;
    }

    return (
        <div className="recipe-display">
            <h1>{title}</h1>
            <VersionedPhoto  
                uploadedFileData={previewPhotoUrl}
                uploadedFileVersionName={photoVersion}
                renderNullWithoutUrl={true}
            />
            <p>{description}</p>
            <h2>Ingredients</h2>
            { mappedIngredients() }
            <h2>Instructions</h2>
            { mappedInstructions() }
        </div>
    );
}

export default RecipeDisplay