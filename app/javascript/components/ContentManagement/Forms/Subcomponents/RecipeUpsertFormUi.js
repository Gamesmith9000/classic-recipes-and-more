import React, { Fragment } from 'react'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../../Utilities/ComponentHelpers'

import BackendConstants from '../../../Utilities/BackendConstants'
import { isValuelessFalsey, objectsHaveMatchingValues } from '../../../Utilities/Helpers'


class RecipeUpsertFormUi extends React.Component {

    // Props retained from parent component:
    // onClose, selectedItemId

    // Stated used from parent (will need conversion)
    // existingRecipe, current (.title, ), prior


    // Copy (coversion) of function in parent component
    isExistingRecipeWithChanges = () => {
        const { parentState } = this.props;
        if(parentState.existingRecipe !== true) { return false; }
        return !objectsHaveMatchingValues(parentState.current, parentState.prior);
    }

    onDragEnd = (result) => {
        if(!result.destination) { return; }

        let listProperty;
        
        switch(result.destination.droppableId) {
            case 'ingredients-editor':
                listProperty = 'ingredients'
                break;
            case 'instructions-editor':
                listProperty = 'instructions'
                break;
            default:
                listProperty = null;
        }

        if(listProperty) { this.props.dragEndStateUpdate(result, listProperty); }
    }

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((element, index) => {
            const arrayIndex = this.props.getItemIndexFromState(element.localId, 'ingredient', 'localId');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`ingr-${element.localId}`} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ingredient-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="ingredient-text-input"
                                    onChange={(event) => this.props.handleTextInputChange(event, 'ingredient', 'textContent' , arrayIndex)}
                                    type="text"
                                    value={this.props.parentState.current.ingredients[arrayIndex].textContent}
                                />
                                { ingredientList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => this.props.handleDeleteButtonInput(event, 'ingredient', arrayIndex)}>
                                        Delete
                                    </button>
                                }
                            </label>
                        </li>
                    )}
                </Draggable>
            )
        });
    }

    mapInstructionInputs = (instructionsList) => {
        return instructionsList.map((element, index) => {
            const arrayIndex = this.props.getItemIndexFromState(element.id, 'instruction');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`inst-${element.id}`} index={index} key={element.id}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="instruction-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="instruction-text-input"
                                    onChange={(event) => this.props.handleTextInputChange(event, 'instruction', 'content', arrayIndex)}
                                    type="text"
                                    value={this.props.parentState.current.instructions[arrayIndex].content}
                                />
                                { instructionsList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => this.props.handleDeleteButtonInput(event, 'instruction', arrayIndex)}>
                                        Delete
                                    </button>
                                }
                            </label>
                        </li>
                    )}
                </Draggable>
            )
        });
    }

    render() {
        const { allowSubmit, onClose, selectedItemId } = this.props;
        const { handleTextInputChange } = this.props;
        // const allowSubmit = (this.props.parentState.existingRecipe === false || objectsHaveMatchingValues(this.props.parentState.current, this.props.parentState.prior) === false);
        // allowSubmit is now a prop

        const renderTitle = (<Fragment>
            <label>
                Title
                <input 
                    className="title-input"
                    maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                    onChange={(event) => this.props.handleUpdateStateOfCurrent(event, 'title')}
                    type="text"
                    value={this.props.parentState.current.title}
                />
                <ValidationErrorDisplay 
                    errorsObject = {this.props.parentState.errors}
                    propertyName = "title"
                />
            </label>
            <br />
        </Fragment>);

        const renderDescription = (<Fragment>
            <label>
                Description
                <textarea 
                    className="description-input"
                    maxLength={BackendConstants.models.recipe.validations.description.maximum} 
                    onChange={(event) => this.props.handleUpdateStateOfCurrent(event, 'description')}
                    type="textarea"
                    value={this.props.parentState.current.description}
                />
                <ValidationErrorDisplay 
                    errorsObject = {this.props.parentState.errors}
                    propertyName = "description"
                />
            </label>
            <br />
        </Fragment>);

        const renderFeatured = (<Fragment>
            <label>
                Featured
                <input 
                    checked={this.props.parentState.current.featured === true}
                    className="featured-input"
                    onChange={(event) => this.props.handleUpdateStateOfCurrent(event, 'featured', 'checked', false)}
                    type="checkbox"
                />
            </label>
            <br />
        </Fragment>);

        const renderIngredients = (<Fragment>
            <label>
            Ingredients
            <br />
            <Droppable droppableId="ingredients-editor" type="ingredient">
                { (provided) => (
                    <ul {...provided.droppableProps} className="ingredients-editor" ref={provided.innerRef}>
                        { this.mapIngredientInputs(this.props.parentState.current.ingredients) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={this.props.handleAddIngredient}>+</button>
            </label>
            <br />
        </Fragment>);

        const renderInstructions = (<Fragment>
            <label>
            Instructions
            <br />
            <Droppable droppableId="instructions-editor" type="instruction">
                { (provided) => (
                    <ul {...provided.droppableProps} className="instructions-editor" ref={provided.innerRef}>
                        { this.mapInstructionInputs(this.props.parentState.current.instructions) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={this.props.handleAddInstruction}>+</button>
            </label>
            <br />
        </Fragment>);

        const renderFormButtons = (<Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={this.props.handleFormSubmit}>
                {this.props.parentState.existingRecipe === true ? 'Update' : 'Create'}
            </button>
            <button onClick={(selectedItemId) => onClose(selectedItemId)}>Close</button>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}/>
        </Fragment>);

        return (
            <form className="recipe-form" onSubmit={this.props.handleFormSubmit}>
                <h2>{this.props.parentState.existingRecipe === true ? 'Edit' : 'New'} Recipe</h2>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { this.props.parentState.existingRecipe === true && isValuelessFalsey(selectedItemId) === false &&
                        <p>ID: {selectedItemId}</p>
                    }
                    { renderTitle }
                    {/* { this.renderPreviewPhotoControl() } */}
                    { renderDescription }
                    { renderFeatured }
                    { renderIngredients }
                    { renderInstructions }
                    { this.props.parentState.photoPicker.isOpen === false &&
                        <Fragment>{ renderFormButtons }</Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
    
}

export default RecipeUpsertFormUi