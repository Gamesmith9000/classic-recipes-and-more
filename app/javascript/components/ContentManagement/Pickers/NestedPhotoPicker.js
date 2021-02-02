import React, { Fragment } from 'react'
import ResourcePicker from './ResourcePicker'
import MappedPhotoPreviewUi from './Subcomponents/MappedPhotoPreviewUi'

class NestedPhotoPicker extends React.Component {
    constructor () {
        super();
        this.state = {
            photoData: null, 
            selectedItemId: null 
        }
    }

    // The only props that need to be passed in:
    //      onCancelAndExit (event)
    //      onPhotoChosenForExport (photoData)
    

    handlePhotoChosenForExport = (event) => {
        event.preventDefault();
        const { onPhotoChosenForExport } = this.props;
        if(!onPhotoChosenForExport) { return; }

        // Note that selectedItemId is always already a parsed int (else null)
        const photoIndex = this.state.photoData.findIndex(element => this.state.selectedItemId === parseInt(element.id));
        if(photoIndex > -1) { onPhotoChosenForExport(this.state.photoData[photoIndex]); }
    }

    render() {
        const { onCancelAndExit } = this.props;
        const mappedPreviewAdditionalProps = { auxButtonText: "Choose", hideEditAndDeleteButtons: true }
        mappedPreviewAdditionalProps.onAuxButtonPress = this.handlePhotoChosenForExport;

        // The exit button will not render without the onCancelAndExit prop
        const exitButton = onCancelAndExit
        ? <button className="exit" onClick={onCancelAndExit}>X</button>
        : <Fragment />;

        return <div className="nested-photo-picker-frame">
            <div className="frame-heading">
                <h2>Choose a Photo</h2>
                { exitButton }
            </div>
            <ResourcePicker 
                additionalClassNames="nested"
                itemName="photo"
                key="photo-picker"
                onDataFetched={(fetchedData) => this.setState({ photoData: fetchedData })}
                onSelectedItemIdChange={(itemId) => this.setState({ selectedItemId: isNaN(itemId) === false ? itemId : null })}
                mappedPreviewAdditionalProps={mappedPreviewAdditionalProps}
                mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} />} 
                // [NOTE][HARD CODED] nonSortByFields is copy-pasted from ContentSectionManager
                nonSortByFields={['file']}
                selectedItemId = { this.state.selectedItemId }
                subcomponentKey="photo"
            />
        </div>
    }
}

export default NestedPhotoPicker

