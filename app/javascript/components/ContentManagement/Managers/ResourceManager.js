import React, { Fragment } from 'react'
import { capitalCase, paramCase, sentenceCase } from 'change-case'

import ContentDashboardContext from '../ContentDashboardContext';
import ResourceDestroyer from '../Destroyers/ResourceDestroyer';
import ResourceUpsertForm from '../Forms/ResourceUpsertForm';
import ResourcePicker from '../Pickers/ResourcePicker'

import { isValuelessFalsey } from '../../Utilities/Helpers';

class ResourceManager extends React.Component {
    constructor () {
        super();
        this.state = ({ ...FormsOpenedState.default  });
    }

    handleDeleteButtonPress = (event) => {
        event.preventDefault();
        this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.destroyer(), true);
    }

    handleUpsertButtonPress = (event, clearSelectedItemId = false) => {
        event.preventDefault();
        this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.upsertForm(), !clearSelectedItemId);
    }

    renderUpsertForm = (additionalProps) => {
        const { upsertFormComponent } = this.props;
        const upsertProps = { ...additionalProps };
        return <Fragment>{upsertFormComponent(upsertProps)}</Fragment>
    }

    updateFormsOpenedState = (newState, doNotChangeSelectedItemId = false, setStateCallback = null) => {
        const updatedState = { ...newState };
        if(doNotChangeSelectedItemId === true) { updatedState.selectedItemId = this.state.selectedItemId }
        else if(isNaN(updatedState.selectedItemId) === true) { updatedState.selectedItemId = null; }
        
        this.setState({ ...updatedState }, setStateCallback);
    }

    render() { 
        const { dashboardContext, itemName, alternateSubcomponentKey } = this.props;
        const { destroyerUiComponent, mappedPreviewUiComponent, upsertFormAdditionalProps, upsertFormUi } = this.props;
        const { mappedPreviewAdditionalProps, nonSortByFields } = this.props;

        const keyProp = paramCase(alternateSubcomponentKey ? alternateSubcomponentKey : itemName);
        const managerClassName = `${paramCase(itemName)} resource-manager`;
        const sharedProps = { itemName, selectedItemId: this.state.selectedItemId, subcomponentKey: keyProp }

        let upsertCloseSetStateCallback = null;
        if(dashboardContext?.updateProperty) {
            const { unsavedChanges, updateProperty } = dashboardContext;
            if(unsavedChanges === true) { 
                upsertCloseSetStateCallback = () => updateProperty('unsavedChanges', false); 
            }
        }

        return (
            <div className={managerClassName}>
                <h1>{`${sentenceCase(itemName)} Manager`}</h1>
                {this.state.destroyerIsOpen === false && this.state.upsertFormIsOpen === false &&
                    <button className={`${paramCase(itemName)} create-item`} onClick={(event) => this.handleUpsertButtonPress(event, true)}>
                        {`Create ${capitalCase(itemName)}`}
                    </button>
                }
                {this.state.destroyerIsOpen === true &&
                    <ResourceDestroyer 
                        {...sharedProps}
                        destroyerUiComponent={destroyerUiComponent}
                        key={`${keyProp}-destroyer`}
                        onClose={(retainSelectedItemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(null), retainSelectedItemId)}
                    />
                }
                {this.state.pickerIsOpen === true &&
                    <ResourcePicker 
                        {...sharedProps}
                        key={`${keyProp}-picker`}
                        mappedPreviewAdditionalProps={mappedPreviewAdditionalProps}
                        mappedPreviewUiComponent={mappedPreviewUiComponent}
                        nonSortByFields={nonSortByFields}
                        onDeleteButtonPress={this.handleDeleteButtonPress}
                        onEditButtonPress={this.handleUpsertButtonPress}
                        onSelectedItemIdChange={(itemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(itemId))}
                    />
                }
                {this.state.upsertFormIsOpen === true &&
                    <ContentDashboardContext.Consumer>
                        { value =>
                            <ResourceUpsertForm 
                                { ...sharedProps }
                                { ...upsertFormAdditionalProps }
                                dashboardContext={value}
                                key={`${keyProp}-upsert-form`}
                                onClose={(retainSelectedItemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(null), retainSelectedItemId, upsertCloseSetStateCallback)}
                                onCreateAndClose={(createdItemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(createdItemId), false, upsertCloseSetStateCallback)}
                                upsertFormUi={upsertFormUi}
                                useNestedPhotoPicker={true}
                            />
                        }
                    </ContentDashboardContext.Consumer>
                }
            </div>
        )
    }
}

export default ResourceManager

const FormsOpenedState = {
    allInactiveExcept: {
        destroyer: function (selectedItemId) { return FormsOpenedState.inactive.except('destroyerIsOpen', selectedItemId) },
        picker: function (selectedItemId) { return FormsOpenedState.inactive.except('pickerIsOpen', selectedItemId) },
        upsertForm: function (selectedItemId) { return FormsOpenedState.inactive.except('upsertFormIsOpen', selectedItemId) }
    },
    default: {
        destroyerIsOpen: false,
        pickerIsOpen: true,
        selectedItemId: null,
        upsertFormIsOpen: false
    },
    filteredId: (idValue) => {            
        const parsedIdValue = parseInt(idValue);
        return (isValuelessFalsey(parsedIdValue) === false && Number.isInteger(parsedIdValue) === true) ? parsedIdValue : null;
    },
    // this item not generally intended to used outside of FormsOpenedState:
    inactive: {
        except: function (propertyName, selectedItemId = null) {
            const openState = { ...FormsOpenedState.inactive.withId(selectedItemId)};
            if(openState.hasOwnProperty(propertyName) === true) { openState[propertyName] = true; }
            else { 
                const validProperties = Object.keys(FormsOpenedState.inactive.value).join(', ');
                console.warn(`Invalid property name: ${propertyName}. Valid options are: ${validProperties}.`) 
            }
            return openState;
        },
        value: {
            destroyerIsOpen: false,
            pickerIsOpen: false,
            selectedItemId: null,
            upsertFormIsOpen: false
        },
        withId: (selectedItemId) => {
            const openState = { ...FormsOpenedState.inactive.value};
            openState.selectedItemId = FormsOpenedState.filteredId(selectedItemId);
            return openState;
        }
    }
}