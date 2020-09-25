import React from 'react'

class RecipeDisplay extends React.Component {
    constructor(props) {
        super();
    }

    mapIngredients = () => {
        
    }

    render() {
        const { paragraphs, recipes, title } = this.props;
        return (
            <div className="recipe">
                <h1>{title}</h1>
            </div>
        )
    }
}

export default RecipeDisplay
