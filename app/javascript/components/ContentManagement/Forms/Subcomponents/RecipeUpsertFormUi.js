import React, { Fragment } from 'react'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../../Utilities/ComponentHelpers'

import BackendConstants from '../../../Utilities/BackendConstants'
import { isValuelessFalsey, objectsHaveMatchingValues } from '../../../Utilities/Helpers'


class RecipeUpsertFormUi extends React.Component {

    isExistingRecipeWithChanges = () => {
        const { parentState } = this.props;
        if(parentState.existingRecipe !== true) { return false; }
        return !objectsHaveMatchingValues(parentState.current, parentState.prior);
    }

    mapIngredientInputs = (ingredientList) => {
        const { getItemIndexFromState, parentState, handleDeleteButtonInput, handleTextInputChange } = this.props;

        return ingredientList.map((element, index) => {
            const arrayIndex = getItemIndexFromState(element.localId, 'ingredient', 'localId');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`ingr-${element.localId}`} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ingredient-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="ingredient-text-input"
                                    onChange={(event) => handleTextInputChange(event, 'ingredient', 'textContent' , arrayIndex)}
                                    type="text"
                                    value={parentState.current.ingredients[arrayIndex].textContent}
                                />
                                { ingredientList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => handleDeleteButtonInput(event, 'ingredient', arrayIndex)}>
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
        const { getItemIndexFromState, parentState, handleDeleteButtonInput, handleTextInputChange } = this.props;

        return instructionsList.map((element, index) => {
            const arrayIndex = getItemIndexFromState(element.id, 'instruction');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`inst-${element.id}`} index={index} key={element.id}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="instruction-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="instruction-text-input"
                                    onChange={(event) => handleTextInputChange(event, 'instruction', 'content', arrayIndex)}
                                    type="text"
                                    value={parentState.current.instructions[arrayIndex].content}
                                />
                                { instructionsList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => handleDeleteButtonInput(event, 'instruction', arrayIndex)}>
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

    validationErrorsIfPresent = (propertyName) => {
        if(!propertyName) { return null; }

        const errorsObject = this.props.parentState?.errors;
        const hasErrors = errorsObject && errorsObject[propertyName] && errorsObject[propertyName].length > 0;
        if(hasErrors === false) { return null; }
        return <ValidationErrorDisplay 
            errorsObject={errorsObject}
            propertyName={propertyName}
        />;
    }
    
    render() {
        const { allowSubmit, onClose, parentState, selectedItemId } = this.props;
        const { handleAddIngredient, handleAddInstruction, handleFormSubmit, handleUpdateStateOfCurrent } = this.props;

        const renderTitle = (<Fragment>
            <label>
                Title
                <input 
                    className="title-input"
                    maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                    onChange={(event) => handleUpdateStateOfCurrent(event, 'title')}
                    type="text"
                    value={parentState.current.title}
                />
                { this.validationErrorsIfPresent('title') }
            </label>
            <br />
        </Fragment>);

        const renderDescription = (<Fragment>
            <label>
                Description
                <textarea 
                    className="description-input"
                    maxLength={BackendConstants.models.recipe.validations.description.maximum} 
                    onChange={(event) => handleUpdateStateOfCurrent(event, 'description')}
                    type="textarea"
                    value={parentState.current.description}
                />
                { this.validationErrorsIfPresent('description') }
            </label>
            <br />
        </Fragment>);

        const renderFeatured = (<Fragment>
            <label>
                Featured
                <input 
                    checked={parentState.current.featured === true}
                    className="featured-input"
                    onChange={(event) => handleUpdateStateOfCurrent(event, 'featured', 'checked', false)}
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
                        { this.mapIngredientInputs(parentState.current.ingredients) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={handleAddIngredient}>+</button>
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
                        { this.mapInstructionInputs(parentState.current.instructions) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={handleAddInstruction}>+</button>
            </label>
            <br />
        </Fragment>);

        const renderFormButtons = (<Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={handleFormSubmit}>
                {parentState.existingRecipe === true ? 'Update' : 'Create'}
            </button>
            <button onClick={(selectedItemId) => onClose(selectedItemId)}>Close</button>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}/>
        </Fragment>);

        return (
            <form className="recipe-form" onSubmit={handleFormSubmit}>
                <h2>{parentState.existingRecipe === true ? 'Edit' : 'New'} Recipe</h2>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { parentState.existingRecipe === true && isValuelessFalsey(selectedItemId) === false &&
                        <p>ID: {selectedItemId}</p>
                    }
                    { renderTitle }
                    {/* { this.renderPreviewPhotoControl() } */}
                    { renderDescription }
                    { renderFeatured }
                    { renderIngredients }
                    { renderInstructions }
                    { parentState.photoPicker.isOpen === false &&
                        <Fragment>{ renderFormButtons }</Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
    
}

export default RecipeUpsertFormUi