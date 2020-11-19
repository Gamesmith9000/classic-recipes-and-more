import axios from 'axios'
import React, { Fragment } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { ExportedPhotoPickerState, RecipeFormRecipeState, RecipeFormSectionState, TextSectionWithId } from '../../Utilities/Constructors'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../Utilities/ComponentHelpers'
import { BackendConstants, isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { mapRecipeSectionsData } from '../../Utilities/ResponseDataHelpers'

import PhotoPicker from '../Pickers/PhotoPicker'

class RecipeForm extends React.Component {
    constructor() {
        super();
        const defaultRecipeState = () => { 
            const defaultIngredientsData = [new TextSectionWithId (0, '')]
            const defaultSectionsData = [new RecipeFormSectionState (0, null, null, '')];
            return new RecipeFormRecipeState('', BackendConstants.models.recipe.defaults.featured, defaultIngredientsData, null, defaultSectionsData, '');
        }
        this.state = {
            current: defaultRecipeState(),
            existingRecipe: false,
            nextUniqueIngredientLocalId: 1,
            nextUniqueSectionLocalId: 1,
            photoPicker: new ExportedPhotoPickerState(false, 0, null, null),
            previewPhotoUrl: null,
            prior: defaultRecipeState(),
        }
    }

    attemptPreviewImageUrlFetch = () => {
        axios.get(`/api/v1/photos/${this.state.current.previewPhotoId}`)
        .then(res => {
            //[NOTE][HARD-CODED] Image preview size is hard coded and the same across recipes
            const url = res.data?.data?.attributes?.file?.small?.url;
            this.setState({ previewPhotoUrl: url });
        })
        .catch(err => console.log(err));
    }

    getIngredientIndexFromState = (localId) => {
        for(let i = 0; i < this.state.current.ingredients.length; i++){
            if(this.state.current.ingredients[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    handleAddIngredient = (event) => {
        event.preventDefault();

        const nextId = this.state.nextUniqueIngredientLocalId;
        let ingredients = this.state.current.ingredients.slice();
        ingredients.push(new TextSectionWithId(nextId, ''));

        let updatedCurrentState = this.state.current;
        updatedCurrentState.ingredients = ingredients;
        this.setState({ 
            current: updatedCurrentState,
            nextUniqueIngredientLocalId: nextId + 1
        });
    }

    handleAddSection = (event) => {
        event.preventDefault();
        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState.push({
            id: null,
            ordered_photo_ids: null,
            recipeId: null,
            text_content: ''
        });
        this.setState({sections: updatedSectionsState});
    }

    handleClearPreviewPhoto = (event) => {
        event.preventDefault();

        let currentState = this.state.current;
        currentState.previewPhotoId = null;
        this.setState({ 
            current: currentState,
            previewPhotoUrl: null
        });
    }

    handleDeleteIngredientButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this ingredient?")) {
            let ingredients = this.state.current.ingredients.slice();
            ingredients.splice(index, 1);

            let updatedCurrentState = this.state.current;
            updatedCurrentState.ingredients = ingredients;
            this.setState({ current: updatedCurrentState }); 
        }
    }

    handleDeleteSectionButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this section?")) {
            let newSectionsState = this.state.sections.slice();
            newSectionsState.splice(index, 1);
            this.setState({sections: newSectionsState});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { description, featured, sections, title } = this.state.current;
        const preview_photo_id = this.state.current.previewPhotoId;
        const ingredients = this.state.current.ingredients.map(value => {  return value.textContent; });

        const requestType = this.state.existingRecipe === true ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe === true ? `/api/v1/recipes/${this.props.recipeId}` : '/api/v1/recipes';

        axios({ method: requestType, url: requestUrl, data: { description, featured, ingredients, preview_photo_id, sections, title } })
        .then(res => {
            if(this.state.existingRecipe === false) { this.props.handleClose(); }
            else { this.handleFormSubmitResponse(res); }
        })
        .catch(err => { this.handleFormSubmitResponse(err); });
    }

    handleFormSubmitResponse = (res) =>{
        if(res?.status === 200 && res.data?.data?.type === "recipe") {
            this.setState({
                errors: null,
                prior: Object.assign({}, this.state.current),
            });
        }
        else if (res?.response?.status === 422) { this.setState({ errors: res.response.data.error }); }
    }

    handleIngredientTextInputChange = (event, index) => {
        let ingredients = this.state.current.ingredients.slice();
        ingredients[index].textContent = event.target.value;
        
        let updatedCurrentState = this.state.current;
        updatedCurrentState.ingredients = ingredients;
        this.setState({ current: updatedCurrentState });
    }

    handlePreviewPhotoIdChange = (event) => {
        event.preventDefault();

        const newId = this.state.photoPicker.selectedPhotoId;
        const newUrl = this.state.photoPicker.selectedPhotoUrl;
        
        let photoPickerState = this.state.photoPicker;
        photoPickerState.isOpen = false;
        photoPickerState.selectedPhotoId = null;
        photoPickerState.selectedPhotoUrl = null;

        let currentState = this.state.current;
        currentState.previewPhotoId = newId;

        this.setState({
            current: currentState,
            previewPhotoUrl: newUrl,
            photoPicker: photoPickerState
        });
    }

    handleSectionTextInputChange = (event, index) => {
        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState[index].text_content = event.target.value;
        this.setState({sections: updatedSectionsState});
    }

    handleTogglePhotoPickerOpenState = (event) => {
        event.preventDefault();

        let photoPickerState = this.state.photoPicker;
        photoPickerState.isOpen = !photoPickerState.isOpen;
        this.setState({ photoPicker: photoPickerState });
    }

    handleUpdateStateOfCurrent = (event, propertyName, propertyOfEventTarget='value', preventDefault = true) => {
        if(event && preventDefault === true) { event.preventDefault(); }
        if(!event || !propertyName || !propertyOfEventTarget || !this.state?.current) { return; }

        let newRecipeState = this.state.current;
        newRecipeState[propertyName] = event.target?.[propertyOfEventTarget];
        this.setState({ current: newRecipeState });
    }

    isExistingRecipeWithChanges = () => {
        if(this.state.existingRecipe !== true) { return false; }
        return !objectsHaveMatchingValues(this.state.current, this.state.prior);
    }

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((element, index) => {
            const arrayIndex = this.getIngredientIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={element.localId.toString()} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ingredient-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="ingredient-input"
                                    onChange={(event) => this.handleIngredientTextInputChange(event, arrayIndex)}
                                    type="text"
                                    value={this.state.current.ingredients[arrayIndex].textContent}
                                />
                                { ingredientList.length > 1 &&
                                    <button className="delete-item" onClick={(event) => this.handleDeleteIngredientButtonInput(event, arrayIndex)}>
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

    mapSectionInputs = (sectionsList) => {
        // Temporary items:
        if(!sectionsList) {
            console.log('sectionsList is falsey. Exiting');
            return;
        }
        if(!this.state.sections){
            console.log('This function still relies on state.sections. Exiting')
            return;
        }

        console.log(sectionsList);
        return sectionsList.map((item, index) => {
            return (
            // [NOTE][OPTIMIZE] Proper key is needed
            <li className="section-edits" key={index}>
                <label>
                    {index}
                    <textarea 
                        className="section-text-input" 
                        onChange={(event) => this.handleSectionTextInputChange(event, index)}
                        value={this.state.sections[index].text_content}
                    />

                    { sectionsList.length > 1 && 
                        <button className="delete-item" onClick={(event) => this.handleDeleteSectionButtonInput(event, index)}>
                            Delete
                        </button>
                    }
                </label>
            </li>
            )
        });
        // [NOTE] Consider changing li key to something other than index.
    }

    onDragEnd = (result) => {
        console.log(result);
        if(!result.destination) { return; }
        if(result.destination.droppableId !== result.source?.droppableId) { return; }

        let newCurrentState = this.state.current;

        if(result.destination.droppableId === 'ingredients-editor') {
            let newIngredientsState = this.state.current.ingredients.slice();
            const movedItem = newIngredientsState.splice(result.source.index, 1)[0];
            newIngredientsState.splice(result.destination.index, 0, movedItem);
            newCurrentState.ingredients = newIngredientsState;
        }

        this.setState({ current: newCurrentState });
    }

    renderPreviewPhotoControl = () => {
        const { current: { previewPhotoId }, previewPhotoUrl, photoPicker: { isOpen, locationId, selectedPhotoId } } = this.state;

        if(previewPhotoId && !previewPhotoUrl) { this.attemptPreviewImageUrlFetch(); }

        return(
            <div className="preview-photo">
                <label>
                    Preview Photo
                    <br/>
                    { (isOpen === true && locationId === 0)
                    ?
                        <PhotoPicker 
                            changeSelectedPhotoId={(newValue) => this.updateStateOfPhotoPicker(newValue, 'selectedPhotoId')}
                            changeSelectedPhotoUrl={(newValue) => this.updateStateOfPhotoPicker(newValue, 'selectedPhotoUrl')}
                            selectedPhotoId={selectedPhotoId}
                            handleCancelForExport={this.handleTogglePhotoPickerOpenState}
                            handleUsePhotoForExport={this.handlePreviewPhotoIdChange}
                        />
                    :
                        <Fragment>
                            { previewPhotoId
                                ? <img src={this.state.previewPhotoUrl} />
                                : '(No photo chosen)'
                            }
                            <br />
                            <button onClick={this.handleTogglePhotoPickerOpenState}>
                                { previewPhotoId ? 'Change' : 'Select' }
                            </button>
                            { previewPhotoId &&
                                <button onClick={this.handleClearPreviewPhoto}>
                                    Use No Photo
                                </button>
                            }
                        </Fragment>
                    }
                </label>
            </div>
        );
    }

    updateStateOfPhotoPicker = (newValue, propertyName) => {
        let newPhotoPickerState = this.state.photoPicker;
        newPhotoPickerState[propertyName] = newValue;
        this.setState({ photoPicker: newPhotoPickerState });
    }

    componentDidMount () {
        if(this.props.recipeId) {
            axios.get(`/api/v1/recipes/${this.props.recipeId}`)
            .then(res => {
                const attributes = res.data.data.attributes;
                const sections = mapRecipeSectionsData(res);
                let ingredientsLength;
                let sectionsLength;

                const currentRecipeState = () => { 
                    const ingredients = attributes.ingredients.map((value, index) => {
                        return (new TextSectionWithId(index, value))
                    });

                    ingredientsLength = ingredients.length;
                    sectionsLength = sections.length;

                    return new RecipeFormRecipeState(attributes.description, attributes.featured, ingredients, 
                        attributes.preview_photo_id, sections, attributes.title
                    );
                }
                
                this.setState({
                    current: currentRecipeState(),
                    existingRecipe: true,
                    nextUniqueIngredientLocalId: ingredientsLength,
                    nextUniqueSectionLocalId: sectionsLength,
                    previewPhotoUrl: null,
                    prior: currentRecipeState(),
                });
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <form className="recipe-form" onSubmit={this.handleFormSubmit}>
                <h2>{this.state.existingRecipe === true ? 'Edit' : 'New'} Recipe</h2>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { this.state.existingRecipe === true && this.props.recipeId &&
                        <p>ID: {this.props.recipeId}</p>
                    }
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
                    { this.renderPreviewPhotoControl() }
                    <br />
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
                    <br />
                    <label>
                        Ingredients
                        <br />
                        <Droppable droppableId="ingredients-editor">
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
                    <br />
                    <label>
                        Sections
                        <br />
                        { this.mapSectionInputs(this.state.current.sections) }
                        {<button onClick={this.handleAddSection}>+</button>}
                    </label>
                    <br/>
                    <br/>
                    { this.state.photoPicker.isOpen === false &&
                        <Fragment>
                            <hr />
                            <button onClick={this.handleFormSubmit}>
                                {this.state.existingRecipe === true ? 'Update' : 'Create'}
                            </button>
                            <button onClick={this.props.handleClose}>Close</button>
                            <UnsavedChangesDisplay 
                                hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}
                            />
                        </Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
}

export default RecipeForm
