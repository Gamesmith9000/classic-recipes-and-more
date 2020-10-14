import React from 'react'
import RecipeForm from '../Forms/RecipeForm';
import RecipePicker from '../RecipePicker';

class RecipeManager extends React.Component {
    constructor () {
        super();
        this.state = {
            deletionPromptIsOpen: false,
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

    handleCloseRecipeFormButtonInput = (event) => {
        event.preventDefault();

        this.setState({
            recipeFormIsOpen: false,
            recipePickerIsOpen: true
        });
    }

    handleDeleteRecipeButtonInput = (event) => {
        event.preventDefault();
        if(!this.state.selectedRecipeId) return;

        this.setState({
            deletionPromptIsOpen: true,
            recipeFormIsOpen: false,
            recipePickerIsOpen: false
        });
        console.log('handleDeleteRecipeButtonInput called');
    }

    handleModifyRecipeButtonInput = (event) => {
        event.preventDefault();
        if(!this.state.selectedRecipeId) return;

        this.setState({
            deletionPromptIsOpen: false,
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
            </div>
        )
    }
}

export default RecipeManager
