import React, { Fragment } from 'react'

class RecipeUpserFormUi extends React.Component {

    // Props retained from parent component:

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((element, index) => {
            const arrayIndex = this.getItemIndexFromState(element.localId, 'ingredient', 'localId');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`ingr-${element.localId}`} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ingredient-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="ingredient-text-input"
                                    onChange={(event) => this.handleTextInputChange(event, 'ingredient', 'textContent' , arrayIndex)}
                                    type="text"
                                    value={this.state.current.ingredients[arrayIndex].textContent}
                                />
                                { ingredientList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => this.handleDeleteButtonInput(event, 'ingredient', arrayIndex)}>
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
            const arrayIndex = this.getItemIndexFromState(element.id, 'instruction');
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`inst-${element.id}`} index={index} key={element.id}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="instruction-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="instruction-text-input"
                                    onChange={(event) => this.handleTextInputChange(event, 'instruction', 'content', arrayIndex)}
                                    type="text"
                                    value={this.state.current.instructions[arrayIndex].content}
                                />
                                { instructionsList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => this.handleDeleteButtonInput(event, 'instruction', arrayIndex)}>
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
        const { onClose, selectedItemId } = this.props;
        const allowSubmit = (this.state.existingRecipe === false || objectsHaveMatchingValues(this.state.current, this.state.prior) === false);

        const renderTitle = (<Fragment>
            <label>
                Title
                <input 
                    className="title-input"
                    maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                    onChange={(event) => this.handleUpdateStateOfCurrent(event, 'title')}
                    type="text"
                    value={this.state.current.title}
                />
                <ValidationErrorDisplay 
                    errorsObject = {this.state.errors}
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
                    onChange={(event) => this.handleUpdateStateOfCurrent(event, 'description')}
                    type="textarea"
                    value={this.state.current.description}
                />
                <ValidationErrorDisplay 
                    errorsObject = {this.state.errors}
                    propertyName = "description"
                />
            </label>
            <br />
        </Fragment>);

        const renderFeatured = (<Fragment>
            <label>
                Featured
                <input 
                    checked={this.state.current.featured === true}
                    className="featured-input"
                    onChange={(event) => this.handleUpdateStateOfCurrent(event, 'featured', 'checked', false)}
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
                        { this.mapIngredientInputs(this.state.current.ingredients) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={this.handleAddIngredient}>+</button>
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
                        { this.mapInstructionInputs(this.state.current.instructions) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
            <button onClick={this.handleAddInstruction}>+</button>
            </label>
            <br />
        </Fragment>);

        const renderFormButtons = (<Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={this.handleFormSubmit}>
                {this.state.existingRecipe === true ? 'Update' : 'Create'}
            </button>
            <button onClick={(selectedItemId) => onClose(selectedItemId)}>Close</button>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}/>
        </Fragment>);

        return (
            <form className="recipe-form" onSubmit={this.handleFormSubmit}>
                <h2>{this.state.existingRecipe === true ? 'Edit' : 'New'} Recipe</h2>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { this.state.existingRecipe === true && isValuelessFalsey(selectedItemId) === false &&
                        <p>ID: {selectedItemId}</p>
                    }
                    { renderTitle }
                    {/* { this.renderPreviewPhotoControl() } */}
                    { renderDescription }
                    { renderFeatured }
                    { renderIngredients }
                    { renderInstructions }
                    { this.state.photoPicker.isOpen === false &&
                        <Fragment>{ renderFormButtons }</Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
    
}

export default RecipeUpserFormUi