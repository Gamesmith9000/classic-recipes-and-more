import React from 'react'

class RecipeForm extends React.Component {
    constructor() {
        super();
        this.state = {
            existingRecipe: false,
            ingredients: [''],
            paragraphs: [''],
            title: ''
        }
    }

    handleAddIngredient = (event) => {
        event.preventDefault();
        let updatedIngredientsState = this.state.ingredients;
        updatedIngredientsState.push('');
        this.setState({ingredients: updatedIngredientsState});
    }

    handleAddParagraph = (event) => {
        event.preventDefault();
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState.push('');
        this.setState({paragraphs: updatedParagraphsState});
    }

    handleIngredientInputChange = (event, index) => {
        let updatedIngredientsState = this.state.ingredients;
        updatedIngredientsState[index] = event.target.value;
        this.setState({ingredients: updatedIngredientsState});
    }

    handleParagraphInputChange = (event, index) => {
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState[index] = event.target.value;
        this.setState({paragraphs: updatedParagraphsState});
    }

    handleTitleInputChange = (event) => {
        this.setState({title: event.target.value});
    }

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((item, index) => {
            return (
            <li className="ingredients-edits" key={index}>
                <label>
                    {index}
                    <input 
                        className="ingredient-input"
                        onChange={(event) => this.handleIngredientInputChange(event, index)}
                        type="text"
                        value={this.state.ingredients[index]}
                    />
                </label>
            </li>
            )
        });
        // [NOTE] Consider changing li key to something other than index.
    }

    mapParagraphInputs = (paragraphList) => {
        return paragraphList.map((item, index) => {
            return (
            <li className="paragraph-edits" key={index}>
                <label>
                    {index}
                    <textarea 
                        className="paragraph-input"
                        onChange={(event) => this.handleParagraphInputChange(event, index)}
                        value={this.state.paragraphs[index]}
                    />
                </label>
            </li>
            )
        });
        // [NOTE] Consider changing li key to something other than index.
    }

    componentDidMount () {
        console.log(`recipeId: ${this.props.recipeId}`);
        if(this.props.recipeId !== null) {
            // try to get item from database
            // if successful, set the existingRecipe to true (along with other state)
        }
    }

    render() {
        const { recipeId } = this.props;

        return (
            <form className="recipe-form">
                <h2>{this.state.existingRecipe ? 'Edit' : 'Create'} Recipe</h2>
                <label>
                    Title
                    <input 
                        className="title-input"
                        onChange={this.handleTitleInputChange}
                        type="text"
                    />
                </label>
                <br />
                <br />
                <label>
                    Ingredients
                    <br />
                    {this.mapIngredientInputs(this.state.ingredients)}
                    <button onClick={this.handleAddIngredient}>+</button>
                </label>
                <br />
                <br />
                <label>
                    Paragraphs
                    <br />
                    {this.mapParagraphInputs(this.state.paragraphs)}
                    <button onClick={this.handleAddParagraph}>+</button>
                </label>
            </form>
        )
    }
}

export default RecipeForm
