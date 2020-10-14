import React from 'react'
import RecipeForm from '../Forms/RecipeForm';
import RecipeDestroyer from '../RecipeDestroyer';
import RecipePicker from '../RecipePicker';

class RecipeManager extends React.Component {
    constructor () {
        super();
        this.state = {
            recipeDestroyerIsOpen: false,
            recipeFormIsOpen: false,
            recipePickerIsOpen: true,
            selectedRecipeId: null
        }
    }

    changeSelectedRecipeId = (newId) => {
        if(newId && !Number.isInteger(newId)) return;

        this.setState({
            selectedRecipeId: newId
        });
    }

    handleCloseRecipeDestroyerButtonInput = () => {
        this.setState({
            recipeDestroyerIsOpen: false,
            recipeFormIsOpen: false,
            recipePickerIsOpen: true
        });
    }

    handleCloseRecipeFormButtonInput = (event) => {
        event.preventDefault();

        this.setState({
            recipeDestroyerIsOpen: false,
            recipeFormIsOpen: false,
            recipePickerIsOpen: true
        });
    }

    handleDeleteRecipeButtonInput = (event) => {
        event.preventDefault();
        if(!this.state.selectedRecipeId) return;

        this.setState({
            recipeDestroyerIsOpen: true,
            recipeFormIsOpen: false,
            recipePickerIsOpen: false
        });
    }

    handleModifyRecipeButtonInput = (event) => {
        event.preventDefault();
        if(!this.state.selectedRecipeId) return;

        this.setState({
            recipeDestroyerIsOpen: false,
            recipeFormIsOpen: true,
            recipePickerIsOpen: false
        });
    }

    render() {
        return (
            <div className="recipe-manager">
                <h1>Recipe Manager</h1>
                {this.state.recipePickerIsOpen === true &&
                    <RecipePicker 
                        changeSelectedRecipeId={this.changeSelectedRecipeId}
                        handleDeleteRecipeButtonInput={this.handleDeleteRecipeButtonInput}
                        handleModifyRecipeButtonInput={this.handleModifyRecipeButtonInput}
                        selectedRecipeId={this.state.selectedRecipeId}
                    />
                }
                {this.state.recipeFormIsOpen === true &&
                    <RecipeForm 
                        closeForm={this.handleCloseRecipeFormButtonInput}
                        recipeId={this.state.selectedRecipeId}
                    />
                }
                {this.state.recipeDestroyerIsOpen === true &&
                    <RecipeDestroyer 
                        handleCloseRecipeDestroyerButtonInput = {this.handleCloseRecipeDestroyerButtonInput}
                        recipeId={this.state.selectedRecipeId} 
                    />
                }
            </div>
        )
    }
}

export default RecipeManager
