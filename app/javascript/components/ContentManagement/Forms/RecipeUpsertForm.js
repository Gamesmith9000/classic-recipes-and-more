import React, { Fragment } from 'react'
import axios from 'axios'
import { camelCase } from 'change-case'

import RecipeUpsertFormUi from './Subcomponents/RecipeUpsertFormUi'

import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'

import VersionedPhoto from '../../Misc/VersionedPhoto'
import BackendConstants from '../../Utilities/BackendConstants'
import { NestedPhotoPickerTarget, TextSectionWithId } from '../../Utilities/Constructors'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { convertResponseForState } from '../../Utilities/ResponseDataHelpers'


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
            prior: defaultRecipeState()
        }
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


    handlePhotoChosen = (photoData) => {
        console.log("Photo Chosen");
        console.log("photoData:");
        console.log(photoData);
        console.log(`photoPickerTarget:`)
        console.log(this.state.photoPickerTarget);

        this.setState({ photoPickerIsOpen: false})
    }

    
    handlePhotoPickerCancelAndExit = (event) => {
        event.preventDefault();
        this.setState({ photoPickerIsOpen: false})
    }


    handleTextInputChange = (event, resourceName, propertyName, index) => {
        const listName = camelCase(resourceName) + 's';

        let updatedList = this.state.current[listName].slice();
        updatedList[index][propertyName] = event.target.value;
        
        let updatedCurrentState = this.state.current;
        updatedCurrentState[listName] = updatedList;
        this.setState({ current: updatedCurrentState });
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
                    prior: currentRecipeState(),
                });
            })
            .catch(err => console.log(err));
        }
    }


    componentDidMount () {
        this.initializeComponentState();
    }


    render() {
        const { onClose, selectedItemId } = this.props;
        const allowSubmit = (this.state.existingRecipe === false || objectsHaveMatchingValues(this.state.current, this.state.prior) === false);

        // [NOTE] This is not the permanent code layout for this section

        const ui =
        <RecipeUpsertFormUi 
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

        return <Fragment>
            { this.state.photoPickerIsOpen === true &&
                <NestedPhotoPicker 
                    onCancelAndExit={this.handlePhotoPickerCancelAndExit} 
                    onPhotoChosenForExport={(photoData) => this.handlePhotoChosen(photoData)} 
                />
            }
            { ui }
        </Fragment>
    }
}

export default RecipeUpsertForm
