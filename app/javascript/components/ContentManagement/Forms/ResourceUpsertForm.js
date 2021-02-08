import React, { Fragment } from 'react'
import axios from 'axios'
import { camelCase, noCase, snakeCase } from 'change-case'

import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'

import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'
import { convertResponseForState } from '../../Utilities/ResponseDataHelpers'

class ResourceUpsertForm extends React.Component {
    constructor(props) {
        super(props);
        const startState = props.createInitialState ? { ...props.createInitialState() } : { };
        startState.errors = { };
        this.state = startState;
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

    handleAddListItem = (event, resourceName) => {
        event.preventDefault();

        const { onAddListItem } = this.props;
        const name = camelCase(resourceName);
        
        if(!onAddListItem || onAddListItem.hasOwnProperty(name) === false) { return; }

        const list = this.state.current[name + 's'].slice();
        const updatedState = onAddListItem[name]({ ...this.state }, list);
        this.setState({ ...updatedState });
    }

    handleDeleteListItem = (event, resourceName, index) => {
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

    handleFormCloseWithConfirmation = (event) => {
        event.preventDefault();

        const { closingWarningItemNameModifier, itemName, onClose } = this.props;
        const isExisting = this.state.isExistingItem;

        // Existing items without changes do not get the confirmation prompt
        if(isExisting === true && this.isExistingItemWithChanges() === false) { onClose(true); }
        else {
            const itemDisplayName = closingWarningItemNameModifier ? closingWarningItemNameModifier(noCase(itemName)) : noCase(itemName);
            const uniqueMessage = isExisting === true 
                ? `Your ${itemDisplayName} has unsaved changes that will be lost.`
                : `This ${itemDisplayName} is incomplete and will be lost.`
            ;
            // Confirm exit without saving
            if(window.confirm(uniqueMessage + ' Are you sure you want to exit?') === true) { onClose(true); }
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { itemName, preSubmit, selectedItemId} = this.props;
        const { finalAdditionalChanges, modifyAssociations, modifyStateData, omittedSubmitProperties, useProcessingSubmissionMessage } = (preSubmit ? preSubmit : { });

        const requestType = this.state.isExistingItem === true ? 'patch' : 'post';
        const requestUrl = `/api/v1/${snakeCase(itemName)}` + (this.state.isExistingItem === true ? `s/${selectedItemId}` : 's');

        const mainData = modifyStateData ? modifyStateData({...this.state.current}) : { ...this.state.current };

        // prepare associations data

        const assocationLists = { many: [], one: []};

        if(this.state.associationPropertyNames?.many?.length > 0 || this.state.associationPropertyNames?.one?.length > 0) {
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

        if(modifyAssociations) { modifyAssociations(assocationLists); }

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

        const submissionData = { ...assocationLists.many, ...assocationLists.one, ...mainData };

        if(omittedSubmitProperties && Array.isArray(omittedSubmitProperties) === true) {
            for(let i = 0; i < omittedSubmitProperties.length; i++) {
                const propertyName = snakeCase(omittedSubmitProperties[i]);
                if(submissionData.hasOwnProperty(propertyName) === true) {
                    delete submissionData[propertyName];
                }
            }
        }

        axios({ method: requestType, url: requestUrl, data: finalAdditionalChanges ? finalAdditionalChanges(requestType, { ...submissionData }) : { ...submissionData } })
        .then( res => { this.handleFormSubmitResponse(res) })
        .catch(err => { this.handleFormSubmitResponse(err) });

        if(useProcessingSubmissionMessage === true){
            this.setState({ submissionIsProcessingWithMessage: true });
        }
    }

    handleFormSubmitResponse = (res) => {
        if(res?.status === 200 && res.data?.data?.type === snakeCase(this.props.itemName)) {
            if(this.state.isExistingItem === false) { this.props.onCreateAndClose(res.data.data.id); }
            else { this.initializeComponentState(); }
        }
        else {
            const additional = this.props.preSubmit?.useProcessingSubmissionMessage === true ?  { submissionIsProcessingWithMessage: false } : { };
            const errors = { ...res?.response?.data?.error };
            this.setState({ ...additional, errors });
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
        const { propertyUpdatesOnPhotoChosen } = this.props;
        if(!photoData) { return; }
        const convertedData = { ...photoData.attributes, id: parseInt(photoData.id) };

        const updatedCurrentState = propertyUpdatesOnPhotoChosen 
            ? propertyUpdatesOnPhotoChosen(convertedData, { ...this.state.current }, { ...this.state.photoPickerTarget })
            : { ...this.state.current }
        ;

        this.setState({
            current: updatedCurrentState,
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

    handleUpdateCurrent = (event, newValue, propertyName, propertyPath = []) => {
        event.preventDefault();
        const { dashboardContext } = this.props;
        const updatedCurrentState = { ...this.state.current };

        const changeItemValue = (containingObject, setEntireObject = false) => {
            if(isValuelessFalsey(newValue) === false && typeof(newValue) === 'object') {
                if(setEntireObject === true) {
                    containingObject[propertyName] = newValue;
                    return;
                }
                // property name is ignored, since it's built into newValue
                for (const [key, value] of Object.entries(newValue)) {
                    containingObject[key] = value;
                }
            }
            else { containingObject[propertyName] = newValue;  }
        }

        if(!propertyPath || Array.isArray(propertyPath) === false || propertyPath.length < 1) {
            changeItemValue(updatedCurrentState, true);
        }
        else {
            let obj = updatedCurrentState;
            const objIsValid = () => {
                if(obj === null) { return false; }
                if(Array.isArray(obj) === true) { return true; }
                return (typeof(obj) === 'object');
            }

            for(let i = 0; i < propertyPath.length && objIsValid() === true; i++) {
                const propName = propertyPath[i];
                obj = obj[propName];
            }

            if(objIsValid() === true) { changeItemValue(obj); }
        }

        const unsavedChangesValue = dashboardContext?.unsavedChanges;
        let callback = null;

        if(isValuelessFalsey(unsavedChangesValue) === false) {
            
            if(this.state.isExistingItem === true) {               
                const existingItemNowChanging = objectsHaveMatchingValues(updatedCurrentState, this.state.prior) === false;

                /* shorthand for:
                    existingItemNowChanging is T and unsavedChangesValue is F, OR
                    existingItemNowChanging is F and unsavedChangesValue is T        
                */
                if(existingItemNowChanging !== unsavedChangesValue) {
                    callback = () => dashboardContext.updateProperty('unsavedChanges', existingItemNowChanging);
                }
            }
            else {
                if(dashboardContext?.unsavedChanges === false) { 
                    callback = () => dashboardContext.updateProperty('unsavedChanges', true); 
                } 
            }
        }
        
        this.setState({ current: updatedCurrentState }, callback);
    }

    handleUpdateCurrentFromEvent = (event, propertyName, propertyOfEventTarget='value', propertyPath = []) => {
        this.handleUpdateCurrent(event, event.target?.[propertyOfEventTarget], propertyName, propertyPath);
    }

    initializeComponentState () {
        const { itemName, selectedItemId, atResponseConversion } = this.props;
        const getUrl = `/api/v1/${snakeCase(itemName + 's')}`;

        if(isValuelessFalsey(selectedItemId) === false) {
            axios.get(`${getUrl}/${selectedItemId}.json`)
            .then(res => {
                // [NOTE][OPTIMIZE]: convertResponseForState function is called up to 4 times.
                //                      The calls are separate to prevent 'current' and 'prior' from being the same object
                
                let assocPropNames = convertResponseForState(res.data).associationPropertyNames;

                const currentItemState = () => { 
                    const newState = convertResponseForState(res.data);
                    delete newState.associationPropertyNames; 

                    if(atResponseConversion?.additionalItemResponseModification) { 
                        return atResponseConversion?.additionalItemResponseModification(newState, res.data.data);
                    }
                    else { return newState; }
                }

                const otherStateChanges = atResponseConversion?.additionalStateModification 
                    ? atResponseConversion?.additionalStateModification(currentItemState(), res.data.data) 
                    : { }
                ;

                this.setState({
                    ...otherStateChanges,
                    associationPropertyNames: assocPropNames,
                    current: currentItemState(),
                    isExistingItem: true,
                    prior: currentItemState(),
                });
            })
            .catch(err => console.log(err));
        }
        else {
            const { dashboardContext } = this.props;
            if(dashboardContext && dashboardContext.unsavedChanges === false) {
                dashboardContext.updateProperty('unsavedChanges', true);
            }
        }
    }

    isExistingItemWithChanges = () => {
        if(this.state.isExistingItem === false) { return false; }
        return !objectsHaveMatchingValues(this.state.current, this.state.prior);
    }

    componentDidMount () {
        this.initializeComponentState();
    }

    render() {
        const { itemName, selectedItemId, upsertFormUi, useNestedPhotoPicker } = this.props;
        const submissionIsProcessingWithMessage = this.state.submissionIsProcessingWithMessage;
        const allowSubmit = (this.state.isExistingItem === false || this.isExistingItemWithChanges() === true) && submissionIsProcessingWithMessage !== true;
        
        const itemKey = this.state.isExistingItem === true ? selectedItemId : 'new';
        const thisComponent = this;


        const upsertProps = {
            allowSubmit,
            dragEndStateUpdate: this.dragEndStateUpdate,
            getItemIndexFromState: (itemId, resourceName, alternateIdPropertyName = null) => thisComponent.getItemIndexFromState(itemId, resourceName, alternateIdPropertyName),
            key: itemKey,
            onAddListItem: (event, resourceName) => thisComponent.handleAddListItem(event, resourceName),
            onClose: this.handleFormCloseWithConfirmation,
            onDeleteButtonInput: (event, resourceName, index) => thisComponent.handleDeleteListItem(event, resourceName, index),
            onFormSubmit: this.handleFormSubmit,
            onOmitRecipePhoto: (event) => thisComponent.handleUpdateCurrent(event, { photo: null, photoId: null }, null),
            onOpenPhotoPicker: (event, descriptor, listIndex) => thisComponent.handleOpenPhotoPicker (event, descriptor, listIndex),
            onUpdateCurrent: (event, newValue, propertyName, propertyPath = []) => thisComponent.handleUpdateCurrent(event, newValue, propertyName, propertyPath),
            onUpdateCurrentFromEvent: (event, propertyName, propertyOfEventTarget='value', propertyPath = []) => thisComponent.handleUpdateCurrentFromEvent(event, propertyName, propertyOfEventTarget, propertyPath),
            parentState: this.state,
            selectedItemId,
            submissionIsProcessingWithMessage
        };

        return <Fragment>
            { useNestedPhotoPicker === true && this.state.photoPickerIsOpen === true &&
                <NestedPhotoPicker 
                    containingResourceName={itemName}
                    onCancelAndExit={this.handlePhotoPickerCancelAndExit} 
                    onPhotoChosenForExport={(photoData) => this.handlePhotoChosen(photoData)} 
                />
            }
            <Fragment>{ upsertFormUi(upsertProps) }</Fragment>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingItemWithChanges() === true} />
        </Fragment>
    }
}

export default ResourceUpsertForm
