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

    mapSections = (sectionsList) => {
        return sectionsList.map((item, index) => {
            return (
                <div className="section">
                    <p key={index}>
                        {item.text_content}
                    </p>
                    <div>
                        {/* PHOTO ELEMENTS WILL MAP HERE */}
                    </div>
                </div>
            )
        });
    }

    render() {
        const { ingredients, paragraphs, sections, title } = this.props;
        return (
            <div className="recipe">
                <h1>{title}</h1>
                <ul>{this.mapIngredients(ingredients)}</ul>
                <Fragment>{this.mapParagraphs(paragraphs)}</Fragment>
                <h2>Sections:</h2>
                <Fragment>{this.mapSections(sections)}</Fragment>
            </div>
        )
    }
}

export default RecipeDisplay
