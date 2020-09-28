import React, { Fragment } from 'react'

class RecipeDisplay extends React.Component {
    constructor() {
        super();
    }

    mapIngredients = (ingredientsList) => {
        return ingredientsList.map((item, index) => {
            return (
                <li className="ingredient" key={index}>
                    {item}
                </li>
            )
        });
    }

    mapParagraphs = (paragraphsList) => {
        return paragraphsList.map((item, index) => {
            return (
                <p key={index}>
                    {item}
                </p>
            )
        });
    }

    render() {
        const { ingredients, paragraphs, title } = this.props;
        return (
            <div className="recipe">
                <h1>{title}</h1>
                <ul>{this.mapIngredients(ingredients)}</ul>
                <Fragment>{this.mapParagraphs(paragraphs)}</Fragment>               
            </div>
        )
    }
}

export default RecipeDisplay
