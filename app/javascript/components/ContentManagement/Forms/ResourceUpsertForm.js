import React, { Fragment } from 'react'
import axios from 'axios'
import { camelCase, snakeCase } from 'change-case'

import RecipeUpsertFormUi from './Subcomponents/RecipeUpsertFormUi'

import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'
import BackendConstants from '../../Utilities/BackendConstants'
import { NestedPhotoPickerTarget, TextSectionWithId } from '../../Utilities/Constructors'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { convertResponseForState } from '../../Utilities/ResponseDataHelpers'


class ResourceUpsertForm extends React.Component {
    //  Conversion from RecipeUpsertForm to a resuable upsert form

    constructor() {
        super();
        const defaultRecipeState = () => { 
            return {
                description: '',
                featured: BackendConstants.models.recipe.defaults.featured,
                ingredients: [new TextSectionWithId (0, '')],
                instructions: [{ content: '', id: -1, ordinal: 0 }],
                title: ''
            }
        }
        this.state = {
            addedInstructionsCount: 1,
            associationPropertyNames: { many: [], one: [] },
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

        // note that excluded properties' names will be automatically converted to snake case
        const excludedProperties = ['photo'];

        const { description, featured, photoId, title } = this.state.current;
        const ingredients = this.state.current.ingredients.map(value => {  return value.textContent; });

        const requestType = this.state.existingRecipe === true ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe === true ? `/api/v1/recipes/${this.props.selectedItemId}` : '/api/v1/recipes';

        const mainData = { description, featured, photoId, title };

        // prepare associations data

        const assocationLists = { many: [], one: []};

        if(this.state.associationPropertyNames.many?.length > 0 || this.state.associationPropertyNames.one?.length > 0) {
            const assocPropNames = { ...this.state.associationPropertyNames };

            for(let i = 0; i < assocPropNames.many?.length; i++) {
                const propertyName = assocPropNames.many[i];
                assocationLists.many[snakeCase(propertyName)] = this.state.current[propertyName];
            }

            for(let i = 0; i < assocPropNames.one?.length; i++) {
                const propertyName = assocPropNames.one[i];
                assocationLists.one[snakeCase(propertyName)] = this.state.current[propertyName];
            }
        }

        if(assocationLists.many?.hasOwnProperty('instructions') === true) {
            for(let i = 0; i < assocationLists.many['instructions'].length; i++) {
                const item = assocationLists.many['instructions'][i];
                item.ordinal = i;
                if(item.id < 0) { item.id = null; }
            }
        }

        // convert remaining key names back to snake case

        const convertKey = (obj, keyName) => {
            const snakeCaseKeyName = snakeCase(keyName);
            if(keyName !== snakeCaseKeyName && obj.hasOwnProperty(keyName) === true) {
                Object.assign(obj, {[snakeCaseKeyName]: obj[keyName]});
                delete obj[keyName];
            }
        }

        const keys = Object.keys(mainData);

        for(let i = 0; i < keys.length; i++) {
            convertKey(mainData, keys[i]);
        }
    
        // aggregate properties and remove specified exclusions

        const submissionData = { ...assocationLists.many, ...assocationLists.one, ...mainData, ingredients };

        for(let i = 0; i < excludedProperties.length; i++) {
            const propertyName = snakeCase(excludedProperties[i]);
            if(submissionData.hasOwnProperty(propertyName) === true) {
                delete submissionData[propertyName];
            }
        }

        axios({ method: requestType, url: requestUrl, data: { ...submissionData } })
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

    handleOpenPhotoPicker = (event, descriptor, listIndex) => {
        event.preventDefault();
        if(this.state.photoPickerIsOpen === true) { return; }

        this.setState({
            photoPickerIsOpen: true,
            photoPickerTarget: { descriptor: descriptor, listIndex: listIndex }
        });
    }

    handlePhotoChosen = (photoData) => {     
        if(!photoData) { return; }
        const newCurrentState = { ...this.state.current };
        const convertedData = { ...photoData.attributes, id: parseInt(photoData.id) };

        if(this.state.photoPickerTarget.descriptor === 'recipe') {
            newCurrentState.photo = convertedData;
            newCurrentState.photoId = convertedData.id;
        }

        this.setState({
            current: newCurrentState,
            photoPickerIsOpen: false,
            photoPickerTarget: { descriptor: null, listIndex: null }
        });
    }

    handlePhotoPickerCancelAndExit = (event) => {
        event.preventDefault();
        this.setState({ 
            photoPickerIsOpen: false,
            photoPickerTarget: { descriptor: null, listIndex: null }
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


    handleUpdateCurrentFromEvent = (event, propertyName, propertyOfEventTarget='value', preventDefault = true) => {
        if(event && preventDefault === true) { event.preventDefault(); }
        if(!event || !propertyName || !propertyOfEventTarget || !this.state?.current) { return; }

        const newRecipeState = { ...this.state.current };
        newRecipeState[propertyName] = event.target?.[propertyOfEventTarget];
        this.setState({ current: newRecipeState });
    }

    handleUpdateCurrentFromList = (event, propertyNames, updatedValues, preventDefault = true) => {
        if(event && preventDefault === true) { event.preventDefault(); }
        if(!this.state.current) { return; }

        let invalidArguments = false;
        let argumentsChecked = false;

        // ensure that propertyNames & updatedValues are non-empty arrays of matching size
        while(invalidArguments === false && argumentsChecked === false) {
            if(!propertyNames || !updatedValues) { invalidArguments = true; }
            if(Array.isArray(propertyNames) === false || Array.isArray(updatedValues) === false) { invalidArguments = true; }
            if(propertyNames.length < 1 || updatedValues.length < 1 || propertyNames.length !== updatedValues.length) { invalidArguments = true; }
            if(invalidArguments === false) { argumentsChecked = true; }
        }
        
        if(invalidArguments === true) { return; }

        const newRecipeState = { ...this.state.current }

        for(let i = 0; i < propertyNames.length; i++) {
            newRecipeState[propertyNames[i]] = updatedValues[i];
        }

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

        return <Fragment>
            { this.state.photoPickerIsOpen === true &&
                <NestedPhotoPicker 
                    onCancelAndExit={this.handlePhotoPickerCancelAndExit} 
                    onPhotoChosenForExport={(photoData) => this.handlePhotoChosen(photoData)} 
                />
            }
            <RecipeUpsertFormUi 
                allowSubmit={allowSubmit}
                dragEndStateUpdate={this.dragEndStateUpdate}
                getItemIndexFromState={(itemId, resourceName, alternateIdPropertyName = null) => this.getItemIndexFromState(itemId, resourceName, alternateIdPropertyName)}
                onAddIngredient={this.handleAddIngredient}
                onAddInstruction={this.handleAddInstruction}
                onClose={onClose}
                onDeleteButtonInput={(event, resourceName, index) => this.handleDeleteButtonInput(event, resourceName, index)}
                onFormSubmit={this.handleFormSubmit}
                onOmitRecipePhoto={(event) => this.handleUpdateCurrentFromList(event, ['photo', 'photoId'], [null, null])}
                onOpenPhotoPicker={(event, descriptor, listIndex) => this.handleOpenPhotoPicker (event, descriptor, listIndex)}
                onTextInputChange={this.handleTextInputChange}
                onUpdateCurrentFromEvent={(event, propertyName, propertyOfEventTarget='value', preventDefault = true) => this.handleUpdateCurrentFromEvent(event, propertyName, propertyOfEventTarget, preventDefault)}
                parentState={this.state}
                selectedItemId={selectedItemId}
            />
        </Fragment>
    }
}

export default ResourceUpsertForm
