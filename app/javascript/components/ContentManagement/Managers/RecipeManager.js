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

    changeSelectedRecipeId = (newId) => {
        if(newId && !Number.isInteger(newId)) return;

        this.setState({
            selectedRecipeId: newId
        });
    }

    render() {
        return (
            <div className="recipe-manager">
                <h1>Recipe Manager</h1>
                {this.state.recipePickerIsOpen === true &&
                    <RecipePicker 
                        changeSelectedRecipeId={this.changeSelectedRecipeId}
                        selectedRecipeId={this.state.selectedRecipeId}
                    />
                }
            </div>
        )
    }
}

export default RecipeManager
