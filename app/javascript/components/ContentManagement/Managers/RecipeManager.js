import React, { Fragment } from 'react'
import RecipeDestroyer from '../Destroyers/RecipeDestroyer';
import RecipeForm from '../Forms/RecipeForm';
import RecipePicker from '../Pickers/RecipePicker';

class RecipeManager extends React.Component {
    // [NOTE] Refactor this component in the same way as PhotoManager

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

    handleCreateRecipeButtonInput = (event) => {
        event.preventDefault();

        this.setState({
            recipeDestroyerIsOpen: false,
            recipeFormIsOpen: true,
            recipePickerIsOpen: false,
            selectedRecipeId: null
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
        if(event){
            event.preventDefault();
        }
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
                {this.state.recipeDestroyerIsOpen === false && this.state.recipeFormIsOpen === false &&
                    <Fragment>
                        <button onClick={this.handleCreateRecipeButtonInput}>
                            Create Recipe
                        </button>
                        <br /> 
                        <br />
                    </Fragment>
                }
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
                        handleClose={this.handleCloseRecipeFormButtonInput}
                        photoPickerPhotoVersion={this.props.photoPickerPhotoVersion}
                        previewPhotoVersion="small"
                        recipeId={this.state.selectedRecipeId}
                    />
                }
                {this.state.recipeDestroyerIsOpen === true &&
                    <RecipeDestroyer 
                        handleClose = {this.handleCloseRecipeDestroyerButtonInput}
                        recipeId={this.state.selectedRecipeId} 
                    />
                }
            </div>
        )
    }
}

export default RecipeManager
