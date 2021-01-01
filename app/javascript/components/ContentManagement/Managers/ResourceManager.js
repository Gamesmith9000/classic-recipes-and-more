import React, { Fragment } from 'react'
import { capitalCase, paramCase } from 'change-case'
import ResourcePicker from '../Pickers/ResourcePicker'
import { isValuelessFalsey } from '../../Utilities/Helpers';
import ResourceDestroyer from '../Destroyers/ResourceDestroyer';

class ResourceManager extends React.Component {
    constructor () {
        super();
        this.state = ({ ...FormsOpenedState.default  });
    }

    handleDeleteButtonPress = (event) => {
        event.preventDefault();
        this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.destroyer(), true);
    }

    handleUpsertButtonPress = (event) => {
        event.preventDefault();
        this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.upsertForm(), true);
    }

    renderUpsertForm = (additionalProps) => {
        const { alternateShowUrl, alternateUpdateUrl, upsertFormComponent } = this.props;
        const upsertProps = {...additionalProps, alternateShowUrl, alternateUpdateUrl };
        return <Fragment>{upsertFormComponent(upsertProps)}</Fragment>
    }

    updateFormsOpenedState = (newState, doNotChangeSelectedItemId = false) => {
        const updatedState = { ...newState };
        if(doNotChangeSelectedItemId === true) { updatedState.selectedItemId = this.state.selectedItemId }
        else if(isNaN(updatedState.selectedItemId) === true) { updatedState.selectedItemId = null; }
        
        this.setState({ ...updatedState });
    }

    render() { 
        const { itemName, alternateSubcomponentKey } = this.props;
        const { alternateCreateUrl, alternateDeleteUrl, alternateIndexUrl, alternateShowUrl, alternateUpdateUrl } = this.props;
        const { destroyerUiComponent, mappedPreviewUiComponent } = this.props;
        const { additionalMappedItemPreviewProps, nonSortByFields } = this.props;

        const keyProp = paramCase(alternateSubcomponentKey ? alternateSubcomponentKey : itemName);
        const managerClassName = `${paramCase(itemName)} resource-manager`;
        const sharedProps = { itemName, selectedItemId: this.state.selectedItemId, subcomponentKey: keyProp }

        return (
            <div className={managerClassName}>
                {this.state.destroyerIsOpen === false && this.state.upsertFormIsOpen === false &&
                    <button className={`${paramCase(itemName)} create-item`} onClick={this.handleUpsertButtonPress}>
                        {`Create ${capitalCase(itemName)}`}
                    </button>
                }
                {this.state.destroyerIsOpen === true &&
                    <ResourceDestroyer 
                        {...sharedProps}
                        alternateDeleteUrl={alternateDeleteUrl}
                        alternateShowUrl={alternateShowUrl}
                        destroyerUiComponent={destroyerUiComponent}
                        key={`${keyProp}-destroyer`}
                        onClose={() => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(null))}
                    />
                }
                {this.state.pickerIsOpen === true &&
                    <ResourcePicker 
                        {...sharedProps}
                        additionalMappedItemPreviewProps={additionalMappedItemPreviewProps}
                        alternateIndexUrl={alternateIndexUrl}
                        key={`${keyProp}-picker`}
                        mappedPreviewUiComponent={mappedPreviewUiComponent}
                        nonSortByFields={nonSortByFields}
                        onDeleteButtonPress={this.handleDeleteButtonPress}
                        onEditButtonPress={this.handleUpsertButtonPress}
                        onSelectedItemIdChange={(itemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(itemId))}
                    />
                }
                {this.state.upsertFormIsOpen === true &&
                    this.renderUpsertForm({...sharedProps, alternateCreateUrl, alternateUpdateUrl, 
                        onClose: (newSelectedItemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(newSelectedItemId))
                    })
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