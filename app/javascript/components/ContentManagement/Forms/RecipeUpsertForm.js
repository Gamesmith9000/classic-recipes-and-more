import axios from 'axios'
import React, { Fragment } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import VersionedPhoto from '../../Misc/VersionedPhoto'
import { ExportedPhotoPickerState, RecipeFormRecipeState, RecipeFormSectionState, TextSectionWithId } from '../../Utilities/Constructors'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../Utilities/ComponentHelpers'
import BackendConstants from '../../Utilities/BackendConstants'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { mapRecipeSectionsData } from '../../Utilities/ResponseDataHelpers'

import PhotoPicker from '../Pickers/PhotoPicker'

class RecipeUpsertForm extends React.Component {
    //  [NOTE] Check all passed in props are implemented, even after obvious items are converted
    //  [NOTE] Reverse also needs to be checked (old props that have not been implemented into new versions - photoVersions, etc.)
    //  [NOTE] Addendum: Consider using React context for the global photo config options. Should be perfect way to refactor

    constructor() {
        super();
        const defaultRecipeState = () => { 
            const defaultIngredientsData = [new TextSectionWithId (0, '')]
            const defaultSectionsData = [new RecipeFormSectionState (null, 0, [], null, '')];
            return new RecipeFormRecipeState('', BackendConstants.models.recipe.defaults.featured, defaultIngredientsData, null, defaultSectionsData, '');
        }
        this.state = {
            current: defaultRecipeState(),
            existingRecipe: false,
            nextUniqueIngredientLocalId: 1,
            nextUniqueSectionLocalId: 1,
            photoPicker: new ExportedPhotoPickerState(false, 0, null, 0),
            previewPhotoUrl: null,
            prior: defaultRecipeState()
        }
    }

    attemptPreviewImageUrlFetch = () => {
        axios.get(`/api/v1/photos/${this.state.current.previewPhotoId}.json`)
        .then(res => {
            const url = BackendConstants.uploaders.safelyGetUploader('photo').getUrlForVersion(res.data.data.attributes.file, this.props.previewPhotoVersion);
            this.setState({ previewPhotoUrl: url });
        })
        .catch(err => console.log(err));
    }

    dragEndStateUpdate = (dragResult, listProperty) => {
        let newCurrentState = this.state.current;
        let newItemsState = this.state.current[listProperty].slice();
        const movedItem = newItemsState.splice(dragResult.source.index, 1)[0];

        newItemsState.splice(dragResult.destination.index, 0, movedItem);
        newCurrentState[listProperty] = newItemsState;
        this.setState({ current: newCurrentState });
    }

    getIngredientIndexFromState = (localId) => {
        for(let i = 0; i < this.state.current.ingredients.length; i++){
            if(this.state.current.ingredients[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    getSectionIndexFromState = (localId) => {
        for(let i = 0; i < this.state.current.sections.length; i++){
            if(this.state.current.sections[i]?.localId === localId) { return i; }
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

        const nextId = this.state.nextUniqueSectionLocalId;
        const recipeId = this.state.existingRecipe === true ? this.state.current.sections[0].recipe_id : null;
        let sections = this.state.current.sections.slice();
        sections.push(new RecipeFormSectionState(null, nextId, [], recipeId, ''));

        let updatedCurrentState = this.state.current;
        updatedCurrentState.sections = sections;
        this.setState({
            current:updatedCurrentState,
            nextUniqueSectionLocalId: nextId + 1
        });
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
            let sections = this.state.current.sections.slice();
            sections.splice(index, 1);

            let updatedCurrentState = this.state.current;
            updatedCurrentState.sections = sections;
            this.setState({ current: updatedCurrentState});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { description, featured, title } = this.state.current;
        const preview_photo_id = this.state.current.previewPhotoId;
        const ingredients = this.state.current.ingredients.map(value => {  return value.textContent; });
        const sections = this.prepareSectionDataForSubmit();

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
        
        let photoPickerState = new ExportedPhotoPickerState(false, null, null, this.state.photoPicker.locationId);
        let currentState = this.state.current;
        currentState.previewPhotoId = newId;

        this.setState({
            current: currentState,
            previewPhotoUrl: newUrl,
            photoPicker: photoPickerState
        });
    }

    handleSectionTextInputChange = (event, index) => {
        let sections = this.state.current.sections.slice();
        sections[index].text_content = event.target.value;

        let updatedCurrentState = this.state.current;
        updatedCurrentState.sections = sections;
        this.setState({ current: updatedCurrentState });
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
                <Draggable draggableId={`ingr-${element.localId}`} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ingredient-edits" ref={provided.innerRef}>
                            <label>
                                <input 
                                    className="ingredient-text-input"
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
        return sectionsList.map((element, index) => {
            const arrayIndex = this.getSectionIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={`sect-${element.localId}`} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="section-edits" ref={provided.innerRef}>
                            <label>
                                <textarea 
                                    className="section-text-input" 
                                    onChange={(event) => this.handleSectionTextInputChange(event, arrayIndex)}
                                    value={this.state.current.sections[arrayIndex].text_content}
                                />
                                { sectionsList.length > 1 && 
                                    <button className="delete-item" onClick={(event) => this.handleDeleteSectionButtonInput(event, arrayIndex)}>
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
            case 'sections-editor':
                listProperty = 'sections'
                break;
            default:
                listProperty = null;
        }

        if(listProperty) { this.dragEndStateUpdate(result, listProperty); }
    }

    prepareSectionDataForSubmit = () => {
        let sections = this.state.current.sections.slice().map((element) => {
            const section = Object.assign({}, element);
            delete section.localId;
            return section;
        });

        if(this.state.existingRecipe === true) {
            const priorSections = this.state.prior.sections;
            let priorIds = [];

            for(let i = 0; i < priorSections.length; i++) {
                const idValue = priorSections[i].id
                if(!isValuelessFalsey(idValue)) { priorIds.push(idValue); }
            }

            const moreSectionsAdded = !(priorSections.length >= sections.length);
            priorIds.sort();

            for(let i = 0; i < this.state.current.sections.length; i++) {
                const inRange = !(moreSectionsAdded === true && i >= priorIds.length);
                sections[i].id = inRange === true ? priorIds[i] : null;
            }
        }

        return sections;
    }

    renderPreviewPhotoControl = () => {
        const { current: { previewPhotoId }, previewPhotoUrl, photoPicker: { isOpen, locationId, selectedPhotoId } } = this.state;
        const hasPreviewPhotoId = isValuelessFalsey(previewPhotoId) === false;

        if(hasPreviewPhotoId === true && !previewPhotoUrl) { this.attemptPreviewImageUrlFetch(); }

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
                            exportedPhotoUrlVersion={this.props.previewPhotoVersion}
                            handleCancelForExport={this.handleTogglePhotoPickerOpenState}
                            handleUsePhotoForExport={this.handlePreviewPhotoIdChange}
                            selectedPhotoId={selectedPhotoId}
                            photoPickerPhotoVersion={this.props.photoPickerPhotoVersion}
                            uploaderNamePrefix={'photo'}
                        />
                    :
                        <Fragment>
                            <VersionedPhoto
                                uploadedFileData={this.state.previewPhotoUrl}
                                uploadedFileVersionName={this.props.previewPhotoVersion}
                                textDisplayForNoPhoto="(No photo chosen)"
                            />
                            <br />
                            <button onClick={this.handleTogglePhotoPickerOpenState}>
                                { hasPreviewPhotoId === true ? 'Change' : 'Select' }
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
            axios.get(`/api/v1/recipes/${this.props.recipeId}.json`)
            .then(res => {
                const attributes = res.data.data.attributes;
                let ingredientsLength;
                let sectionsLength;

                const currentRecipeState = () => { 
                    const sections = mapRecipeSectionsData(res);
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
                    prior: currentRecipeState()
                });
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        const allowSubmit = (this.state.existingRecipe === false || objectsHaveMatchingValues(this.state.current, this.state.prior) === false);

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
                    <br />
                    <label>
                        Sections
                        <br />
                        <Droppable droppableId="sections-editor" type="section">
                            { (provided) => (
                                <ul {...provided.droppableProps} className="sections-editor" ref={provided.innerRef}>
                                    { this.mapSectionInputs(this.state.current.sections) }
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                        <button onClick={this.handleAddSection}>+</button>
                    </label>
                    <br/>
                    <br/>
                    { this.state.photoPicker.isOpen === false &&
                        <Fragment>
                            <hr />
                            <button disabled={allowSubmit === false} onClick={this.handleFormSubmit}>
                                {this.state.existingRecipe === true ? 'Update' : 'Create'}
                            </button>
                            <button onClick={this.props.handleClose}>Close</button>
                            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}/>
                        </Fragment>
                    }
                </DragDropContext>
            </form>
        )
    }
}

export default RecipeUpsertForm
