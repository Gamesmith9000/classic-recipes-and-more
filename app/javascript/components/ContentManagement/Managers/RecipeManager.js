import React from 'react'
import RecipePicker from '../RecipePicker';

class RecipeManager extends React.Component {
    constructor () {
        super();
        this.state = {
            hasRecipeSelected: false,
            recipePickerIsOpen: true, // might need this to default to false
            selectedRecipeId: null
        }
    }
    render() {
        return (
            <div className="recipe-manager">
                <h1>Recipe Manager</h1>
                {this.state.recipePickerIsOpen === true &&
                    <RecipePicker 

                    />
                }
            </div>
        )
    }
}

export default RecipeManager
