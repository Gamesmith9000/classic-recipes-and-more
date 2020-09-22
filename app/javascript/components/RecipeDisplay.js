import React from 'react'

class RecipeDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    mapIngredients = () => {
        
    }

    componentDidMount () {

    }

    render() {
        const { paragraphs, recipes, title } = this.props;
        return (
            <div className="recipe">
                [RecipeDisplay Component]
                <h1>{title}</h1>
            </div>
        )
    }
}

export default RecipeDisplay
