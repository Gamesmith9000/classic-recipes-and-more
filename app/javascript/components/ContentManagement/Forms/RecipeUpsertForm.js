import React, { Fragment } from 'react'
import axios from 'axios'
import { camelCase } from 'change-case'

import RecipeUpsertFormUi from './Subcomponents/RecipeUpsertFormUi'

import PhotoPicker from '../Pickers/PhotoPicker'

import VersionedPhoto from '../../Misc/VersionedPhoto'
import BackendConstants from '../../Utilities/BackendConstants'
import { ExportedPhotoPickerState, NestedPhotoPickerTarget, TextSectionWithId } from '../../Utilities/Constructors'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { convertResponseForState } from '../../Utilities/ResponseDataHelpers'
import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'


class RecipeUpsertForm extends React.Component {
    //  [NOTE] Check all passed in props are implemented, even after obvious items are converted
    //  [NOTE] Reverse also needs to be checked (old props that have not been implemented into new versions - photoVersions, etc.)
    //  [NOTE] Addendum: Consider using React context for the global photo config options. Should be perfect way to refactor


    constructor() {
        super();
        const defaultRecipeState = () => { 
            return {
                associationPropertyNames: null,
                description: '',
                featured: BackendConstants.models.recipe.defaults.featured,
                ingredients: [new TextSectionWithId (0, '')],
                instructions: [{ content: '', id: -1, ordinal: 0 }],
                title: ''
            }
        }
        this.state = {
            addedInstructionsCount: 1,
            current: defaultRecipeState(),
            existingRecipe: false,
            nextUniqueIngredientLocalId: 1,
            photoPickerIsOpen: false,
            photoPickerTarget: new NestedPhotoPickerTarget(null, null),
            previewPhotoData: null,
            previewPhotoUrl: null,
            prior: defaultRecipeState()
        }
    }

    // Outdated
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
        let newItemsState = newCurrentState[listProperty].slice();
        const movedItem = newItemsState.splice(dragResult.source.index, 1)[0];

        newItemsState.splice(dragResult.destination.index, 0, movedItem);
        newCurrentState[listProperty] = newItemsState;

        this.setState({ current: newCurrentState });
    }

    getItemIndexFromState (itemId, resourceName, alternateIdPropertyName = null) {
        const listName = camelCase(resourceName) + 's';
        const idProperty = isValuelessFalsey(alternateIdPropertyName) === false && typeof(alternateIdPropertyName) === 'string' ? alternateIdPropertyName : 'id';

        for(let i = 0; i < this.state.current[listName].length; i++){
            if(this.state.current[listName][i][idProperty] === itemId) { return i; }
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


    handleAddInstruction = (event) => {
        event.preventDefault();

        const nextId = (this.state.addedInstructionsCount + 1) * -1;
        let instructions = this.state.current.instructions.slice();
        instructions.push({ content: '', id: nextId, ordinal: null });

        let updatedCurrentState = this.state.current;
        updatedCurrentState.instructions = instructions;
        this.setState({ 
            addedInstructionsCount: -nextId,
            current: updatedCurrentState,
        });
    }

    // Outdated
    handleClearPreviewPhoto = (event) => {
        event.preventDefault();

        let currentState = this.state.current;
        currentState.previewPhotoId = null;
        this.setState({ 
            current: currentState,
            previewPhotoUrl: null
        });
    }

    handleDeleteButtonInput = (event, resourceName, index) => {
        event.preventDefault();
        
        const name = camelCase(resourceName);
        const listName = name + 's';

        if(window.confirm(`Are you sure you want to delete this ${name}?`)) {
            let updatedList = this.state.current[listName].slice();
            updatedList.splice(index, 1);

            let updatedCurrentState = this.state.current;
            updatedCurrentState[listName] = updatedList;
            this.setState({ current: updatedCurrentState }); 
        }
    }


    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { description, featured, title } = this.state.current;
        const preview_photo_id = this.state.current.previewPhotoId;
        const ingredients = this.state.current.ingredients.map(value => {  return value.textContent; });

        const requestType = this.state.existingRecipe === true ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe === true ? `/api/v1/recipes/${this.props.selectedItemId}` : '/api/v1/recipes';

        const assocationLists = {};

        for(let i = 0; i < this.state.current.associationPropertyNames.length; i++) {
            const propertyName = this.state.current.associationPropertyNames[i];
            assocationLists[propertyName] = this.state.current[propertyName];
        }

        if(assocationLists.hasOwnProperty('instructions') === true) {
            for(let i = 0; i < assocationLists['instructions'].length; i++) {
                const item = assocationLists['instructions'][i];
                item.ordinal = i;
                if(item.id < 0) { item.id = null; }
            }
        }

        axios({ method: requestType, url: requestUrl, data: { ...assocationLists, description, featured, ingredients, preview_photo_id, title } })
        .then( res => { this.handleFormSubmitResponse(res) })
        .catch(err => { this.handleFormSubmitResponse(err) });
    }


    handleFormSubmitResponse = (res) => {
        if(res?.status === 200 && res.data?.data?.type === "recipe") {
            if(this.state.existingRecipe === false) { this.props.onClose(res.data.data.id); }
            else { this.initializeComponentState(); }
        }
        else { 
            const errors = { ...res?.response?.data?.error?.error };
            this.setState({ errors: errors });
        }
    }

    // Outdated
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

    handleTextInputChange = (event, resourceName, propertyName, index) => {
        const listName = camelCase(resourceName) + 's';

        let updatedList = this.state.current[listName].slice();
        updatedList[index][propertyName] = event.target.value;
        
        let updatedCurrentState = this.state.current;
        updatedCurrentState[listName] = updatedList;
        this.setState({ current: updatedCurrentState });
    }

    // Outdated
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


    initializeComponentState () {
        const { selectedItemId } = this.props;

        if(isValuelessFalsey(selectedItemId) === false) {
            axios.get(`/api/v1/recipes/${selectedItemId}.json`)
            .then(res => {
                const attributes = res.data.data.attributes;
                let ingredientsLength = attributes.ingredients.length;
                let assocPropNames = convertResponseForState(res.data).associationPropertyNames;

                const currentRecipeState = () => { 
                    const newState = convertResponseForState(res.data);
                    const ingredients = attributes.ingredients.map((value, index) => {  return (new TextSectionWithId(index, value)) });

                    newState.ingredients = ingredients;
                    newState.addedInstructionsCount = 0;
                    newState.instructions.sort((a, b) => a.ordinal - b.ordinal);

                    delete newState.addedInstructionsCount
                    delete newState.associationPropertyNames;   
                    return newState;
                }

                this.setState({
                    addedInstructionsCount: 0,
                    associationPropertyNames: assocPropNames,
                    current: currentRecipeState(),
                    existingRecipe: true,
                    nextUniqueIngredientLocalId: ingredientsLength,
                    previewPhotoUrl: null,
                    prior: currentRecipeState(),
                });
            })
            .catch(err => console.log(err));
        }
    }


    // Outdated
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
                            uploaderNamePrefix={'photo'}
                        />
                    :
                        <Fragment>
                            <VersionedPhoto
                                uploadedFileData={this.state.previewPhotoUrl}
                                uploadedFileVersionName={this.props.previewPhotoVersion}
                                uploaderNamePrefix="photo"
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

    // Outdated
    updateStateOfPhotoPicker = (newValue, propertyName) => {
        let newPhotoPickerState = this.state.photoPicker;
        newPhotoPickerState[propertyName] = newValue;
        this.setState({ photoPicker: newPhotoPickerState });
    }

    componentDidMount () {
        this.initializeComponentState();
    }


    render() {
        const { onClose, selectedItemId } = this.props;
        const allowSubmit = (this.state.existingRecipe === false || objectsHaveMatchingValues(this.state.current, this.state.prior) === false);

        return <RecipeUpsertFormUi 
            allowSubmit={allowSubmit}
            dragEndStateUpdate={this.dragEndStateUpdate}
            getItemIndexFromState={(itemId, resourceName, alternateIdPropertyName = null) => this.getItemIndexFromState(itemId, resourceName, alternateIdPropertyName)}
            handleAddIngredient={this.handleAddIngredient}
            handleAddInstruction={this.handleAddInstruction}
            handleDeleteButtonInput={(event, resourceName, index) => this.handleDeleteButtonInput(event, resourceName, index)}
            handleFormSubmit={this.handleFormSubmit}
            handleTextInputChange={this.handleTextInputChange}
            handleUpdateStateOfCurrent={(event, propertyName, propertyOfEventTarget='value', preventDefault = true) => this.handleUpdateStateOfCurrent(event, propertyName, propertyOfEventTarget, preventDefault)}
            onClose={onClose}
            parentState={this.state}
            selectedItemId={selectedItemId}
        />
    }
}

export default RecipeUpsertForm
