import React, { Fragment } from 'react'
import axios from 'axios'
import { camelCase, snakeCase } from 'change-case'

import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'

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

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { itemName, preSubmit, selectedItemId} = this.props;
        const { modifyAssociations, modifyStateData, omittedSubmitProperties } = (preSubmit ? preSubmit : { });

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
        
        axios({ method: requestType, url: requestUrl, data: { ...submissionData } })
        .then( res => { this.handleFormSubmitResponse(res) })
        .catch(err => { this.handleFormSubmitResponse(err) });
    }

    handleFormSubmitResponse = (res) => {
        if(res?.status === 200 && res.data?.data?.type === snakeCase(this.props.itemName)) {
            if(this.state.isExistingItem === false) { this.props.onClose(res.data.data.id); }
            else { this.initializeComponentState(); }
        }
        else {
            const errors = { ...res?.response?.data?.error };
            this.setState({ errors });
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
        const updatedCurrentState = { ...this.state.current };

        const changeItemValue = (containingObject) => {
            if(isValuelessFalsey(newValue) === false && typeof(newValue) === 'object') {
                // property name is ignored, since it's built into newValue
                for (const [key, value] of Object.entries(newValue)) {
                    containingObject[key] = value;
                }
            }
            else { containingObject[propertyName] = newValue;  }
        }

        if(!propertyPath || Array.isArray(propertyPath) === false || propertyPath.length < 1) {
            changeItemValue(updatedCurrentState, propertyName);
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
        
        this.setState({ current: updatedCurrentState });
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
    }

    componentDidMount () {
        this.initializeComponentState();
    }

    render() {
        const { itemName, onClose, selectedItemId, upsertFormUi, useNestedPhotoPicker } = this.props;
        const allowSubmit = (this.state.isExistingItem === false || objectsHaveMatchingValues(this.state.current, this.state.prior) === false);
        const componentObject = this;

        const upsertProps = {
            allowSubmit: allowSubmit,
            dragEndStateUpdate: this.dragEndStateUpdate,
            getItemIndexFromState: (itemId, resourceName, alternateIdPropertyName = null) => componentObject.getItemIndexFromState(itemId, resourceName, alternateIdPropertyName),
            key: componentObject.state.isExistingItem === true ? selectedItemId : 'new',
            onAddListItem: (event, resourceName) => componentObject.handleAddListItem(event, resourceName),
            onClose: onClose,
            onDeleteButtonInput: (event, resourceName, index) => componentObject.handleDeleteListItem(event, resourceName, index),
            onFormSubmit: componentObject.handleFormSubmit,
            onOmitRecipePhoto: (event) => componentObject.handleUpdateCurrent(event, { photo: null, photoId: null }, null),
            onOpenPhotoPicker: (event, descriptor, listIndex) => componentObject.handleOpenPhotoPicker (event, descriptor, listIndex),
            onUpdateCurrent: (event, newValue, propertyName, propertyPath = []) => componentObject.handleUpdateCurrent(event, newValue, propertyName, propertyPath),
            onUpdateCurrentFromEvent: (event, propertyName, propertyOfEventTarget='value', propertyPath = []) => componentObject.handleUpdateCurrentFromEvent(event, propertyName, propertyOfEventTarget, propertyPath),
            parentState: componentObject.state,
            selectedItemId: selectedItemId
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
        </Fragment>
    }
}

export default ResourceUpsertForm
