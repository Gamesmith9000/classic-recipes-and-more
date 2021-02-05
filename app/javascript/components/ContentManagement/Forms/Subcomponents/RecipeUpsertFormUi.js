import React, { Fragment } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import ContentOptionsContext from '../../ContentOptionsContext'

import VersionedPhoto from '../../../Misc/VersionedPhoto'
import BackendConstants from '../../../Utilities/BackendConstants'
import { UnsavedChangesDisplay, validationErrorsIfPresent } from '../../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues } from '../../../Utilities/Helpers'


class RecipeUpsertFormUi extends React.Component {

    isExistingRecipeWithChanges = () => {
        const { parentState } = this.props;
        if(parentState.isExistingItem !== true) { return false; }
        return !objectsHaveMatchingValues(parentState.current, parentState.prior);
    }

    mapIngredientInputs = (ingredientList) => {
        const { getItemIndexFromState, parentState, onDeleteButtonInput, onUpdateCurrentFromEvent } = this.props;

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
                                    onChange={(event) => onUpdateCurrentFromEvent(event, 'textContent', 'value', ['ingredients', arrayIndex])}
                                    type="text"
                                    value={parentState.current.ingredients[arrayIndex].textContent}
                                />
                                { ingredientList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => onDeleteButtonInput(event, 'ingredient', arrayIndex)}>
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
        const { getItemIndexFromState, parentState, onDeleteButtonInput, onUpdateCurrentFromEvent } = this.props;

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
                                    onChange={(event) => onUpdateCurrentFromEvent(event, 'content', 'value', ['instructions', arrayIndex])}
                                    type="text"
                                    value={parentState.current.instructions[arrayIndex].content}
                                />
                                { instructionsList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => onDeleteButtonInput(event, 'instruction', arrayIndex)}>
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
 
    render() {
        const { allowSubmit, onClose, parentState, selectedItemId } = this.props;
        const { onAddListItem, onFormSubmit, onOmitRecipePhoto, onOpenPhotoPicker, onUpdateCurrentFromEvent } = this.props;

        const renderTitle = <Fragment>
            <label>
                Title
                <input 
                    className="title-input"
                    maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                    onChange={(event) => onUpdateCurrentFromEvent(event, 'title')}
                    type="text"
                    value={parentState.current.title}
                />
                { validationErrorsIfPresent('title', parentState?.errors) }
            </label>
            <br />
        </Fragment>

        const renderDescription = <Fragment>
            <label>
                Description
                <textarea 
                    className="description-input"
                    maxLength={BackendConstants.models.recipe.validations.description.maximum} 
                    onChange={(event) => onUpdateCurrentFromEvent(event, 'description')}
                    type="textarea"
                    value={parentState.current.description}
                />
                { validationErrorsIfPresent('description', parentState?.errors) }
            </label>
            <br />
        </Fragment>

        const renderFeatured = <Fragment>
            <label>
                Featured
                <input 
                    checked={parentState.current.featured === true}
                    className="featured-input"
                    onChange={(event) => onUpdateCurrentFromEvent(event, 'featured', 'checked', false)}
                    type="checkbox"
                />
            </label>
            <br />
        </Fragment>

        const photoState = parentState?.current?.photo;

        const renderPhoto = <Fragment>
        <label>
            Photo
            <br />
            <ContentOptionsContext.Consumer>
                { value =>
                    <VersionedPhoto 
                        uploadedFileData={photoState?.file}
                        uploaderNamePrefix="photo"
                        uploadedFileVersionName={value.photoPicker.exportedImageVersion}
                        textDisplayForNoPhoto="(No photo chosen)"
                    />
                }
                </ContentOptionsContext.Consumer>
                { photoState &&
                    <br />
                }
                <button onClick={(event) => onOpenPhotoPicker(event, 'recipe', null)}>
                    { photoState ? 'Change' : 'Select' }
                </button>
                <button disabled={!photoState} onClick={onOmitRecipePhoto}>
                    Use No Photo
                </button>
            </label>
            <br />
        </Fragment>

        const renderIngredients = <Fragment>
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
            <button onClick={(event) => onAddListItem(event, 'ingredient')}>+</button>
            </label>
            <br />
        </Fragment>

        const renderInstructions = <Fragment>
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
            <button onClick={(event) => onAddListItem(event, 'instruction')}>+</button>
            </label>
            <br />
        </Fragment>

        const renderFormButtons = <Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={onFormSubmit}>
                {parentState.isExistingItem === true ? 'Update' : 'Create'}
            </button>
            <button onClick={(selectedItemId) => onClose(selectedItemId)}>Close</button>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}/>
        </Fragment>

        return (
            <form className="recipe-form" onSubmit={onFormSubmit}>
                <h2>{parentState.isExistingItem === true ? 'Edit' : 'New'} Recipe</h2>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { parentState.isExistingItem === true && isValuelessFalsey(selectedItemId) === false &&
                        <p>ID: {selectedItemId}</p>
                    }
                    { renderTitle }
                    { renderDescription }
                    { renderFeatured }
                    { renderPhoto }
                    { renderIngredients }
                    { renderInstructions }
                    { parentState.photoPickerIsOpen === false &&
                        <Fragment>{ renderFormButtons }</Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
}

export default RecipeUpsertFormUi