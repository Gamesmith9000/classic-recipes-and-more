import React from 'react'
import { paramCase } from 'change-case'
import Picker from '../Pickers/Picker'

class ResourceManager extends React.Component {
    constructor () {
        super();
        this.state = ({
            destroyerIsOpen: false,
            upsertFormIsOpen: false,
            pickerIsOpen: true,
            selectedItemId: null
        });
    }

    closeAllExceptPicker = (newId = this.state.selectedPhotoId) => {
        this.setState({
            destroyerIsOpen: false,
            upsertFormIsOpen: false,
            pickerIsOpen: true,
            selectedItemId: isNaN(newId) === true ? null : newId
        });
    }

    handleDeleteButtonPress = (event) => {
        event.preventDefault();
    }

    handleEditButtonPress = (event) => {
        event.preventDefault();
    }

    handleSelectedItemIdChange = (newId) => {
        this.setState({ selectedItemId: isNaN(newId) === true ? null : newId }); 
    }
    
    render() { 
        const { additionalMappedItemPreviewProps, alternateGetUri, alternateSubcomponentKey, itemName, mappedItemPreviewComponent, nonSortByFields } = this.props;  // match exactly with picker
        const keyProp = alternateSubcomponentKey ? alternateSubcomponentKey : itemName;
        const managerClassName = `${paramCase(itemName)}-manager`;

        return (
            <div className={managerClassName}>
                {this.state.pickerIsOpen === true &&
                    <Picker 
                        additionalMappedItemPreviewProps={additionalMappedItemPreviewProps}
                        alternateGetUri={alternateGetUri}
                        itemName={itemName}
                        key={keyProp}
                        mappedItemPreviewComponent={mappedItemPreviewComponent}
                        nonSortByFields={nonSortByFields}
                        onDeleteButtonPress={this.handleDeleteButtonPress}
                        onEditButtonPress={this.handleEditButtonPress}
                        onSelectedItemIdChange={this.handleSelectedItemIdChange}
                        selectedItemId={this.state.selectedItemId}
                        subcomponentKey={keyProp}                       
                    />
                }
            </div>
        )
    }
}

export default ResourceManager
