import React from 'react'
import { isValuelessFalsey } from '../../Utilities/Helpers'


function RecipeDisplay (props) {
    const { description, featured, ingredients, previewPhotoUrl, sections, title } = props;

    const displayPermitted = featured === true ? true : (props.allowUnfeatured && props.allowUnfeatured === true);
    if(displayPermitted === false) { return; }

    const mappedIngredients = () => {
        if(!ingredients) { return; }

        const mapped = ingredients.map((element, index) => {
            return <div className="ingredient" key={index}>{element}</div>;
        })

        return <div className="ingredients">{mapped}</div>;
    }

    const mappedSections = () => {
        if(!sections) { return; }

        const mapped = sections.map((element, index) => {
            // [NOTE] Since photos cannot yet be added by admin to recipe sections, they are not mapped here
            return <div className="section" key={index}>{element.text_content}</div>;
        })

        return <div className="sections">{mapped}</div>;
    }

    return (
        <div className="recipe-display">
            <h1>{title}</h1>
            { isValuelessFalsey(previewPhotoUrl) === false &&
                <img src={previewPhotoUrl} />
            }
            <p>{description}</p>
            <h2>Ingredients</h2>
            { mappedIngredients() }
            <h2>Instructions</h2>
            { mappedSections() }
        </div>
    );
}

export default RecipeDisplay