import React from 'react'
import { paramCase } from 'change-case'
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

    handleEditButtonPress = (event) => {
        event.preventDefault();
        this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.upsertForm(), true);
    }

    updateFormsOpenedState = (newState, doNotChangeSelectedItemId = false) => {
        const updatedState = { ...newState };
        if(doNotChangeSelectedItemId === true) { updatedState.selectedItemId = this.state.selectedItemId }
        else if(isNaN(updatedState.selectedItemId) === true) { updatedState.selectedItemId = null; }
        this.setState({ ...updatedState });
    }

    render() { 
        const { additionalMappedItemPreviewProps, alternateGetUri, alternateSubcomponentKey, itemName, mappedItemPreviewComponent, nonSortByFields } = this.props;
        const keyProp = alternateSubcomponentKey ? alternateSubcomponentKey : itemName;
        const managerClassName = `${paramCase(itemName)}-manager`;

        return (
            <div className={managerClassName}>
                {this.state.pickerIsOpen === true &&
                    <ResourcePicker 
                        additionalMappedItemPreviewProps={additionalMappedItemPreviewProps}
                        alternateGetUri={alternateGetUri}
                        itemName={itemName}
                        key={keyProp}
                        mappedItemPreviewComponent={mappedItemPreviewComponent}
                        nonSortByFields={nonSortByFields}
                        onDeleteButtonPress={this.handleDeleteButtonPress}
                        onEditButtonPress={this.handleEditButtonPress}
                        onSelectedItemIdChange={(itemId) => this.updateFormsOpenedState(FormsOpenedState.allInactiveExcept.picker(itemId))}
                        selectedItemId={this.state.selectedItemId}
                        subcomponentKey={keyProp}
                    />
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