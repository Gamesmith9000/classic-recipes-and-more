import React from 'react'
import ResourcePicker from './ResourcePicker'
import MappedPhotoPreviewUi from './Subcomponents/MappedPhotoPreviewUi'

class NestedPhotoPicker extends React.Component {
    constructor () {
        super();
        this.state = { selectedItemId: null }
    }

    handlePhotoChosenForExport = (event) => {
        event.preventDefault();
        const { onPhotoChosenForExport } = this.props;
        if(onPhotoChosenForExport) { onPhotoChosenForExport(this.state.selectedItemId); }
    }

    render() {
        const additionalMappedItemPreviewProps = { auxButtonText: "Choose", hideEditAndDeleteButtons: true }
        additionalMappedItemPreviewProps.onAuxButtonPress = this.handlePhotoChosenForExport;

        return (
            <ResourcePicker 
                additionalClassNames="nested"
                additionalMappedItemPreviewProps={additionalMappedItemPreviewProps}
                itemName="photo"
                key="photo-picker"
                onSelectedItemIdChange={(itemId) => this.setState({ selectedItemId: isNaN(itemId) === false ? itemId : null })}
                mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} />} 
                // [NOTE][HARD CODED] nonSortByFields is copy-pasted from ContentSectionManager
                nonSortByFields={['file']}
                selectedItemId = { this.state.selectedItemId }
                subcomponentKey="photo"
            />
        );
    }
}

export default NestedPhotoPicker

