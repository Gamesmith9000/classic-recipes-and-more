import { paramCase } from 'change-case';
import React, { Fragment } from 'react'
import ResourcePicker from './ResourcePicker'
import MappedPhotoPreviewUi from './Subcomponents/MappedPhotoPreviewUi'

class NestedPhotoPicker extends React.Component {
    // Required props: onCancelAndExit (event), onPhotoChosenForExport (photoData)

    constructor () {
        super();
        this.state = {
            photoData: null, 
            selectedItemId: null 
        }
    }

    handlePhotoChosenForExport = (event) => {
        event.preventDefault();
        const { onPhotoChosenForExport } = this.props;
        if(!onPhotoChosenForExport) { return; }

        // Note that selectedItemId is always already a parsed int (else null)
        const photoIndex = this.state.photoData.findIndex(element => this.state.selectedItemId === parseInt(element.id));
        if(photoIndex > -1) { onPhotoChosenForExport(this.state.photoData[photoIndex]); }
    }

    render() {
        const { containingResourceName, onCancelAndExit } = this.props;
        const mappedPreviewAdditionalProps = { auxButtonText: "Choose", hideEditAndDeleteButtons: true }
        mappedPreviewAdditionalProps.onAuxButtonPress = this.handlePhotoChosenForExport;

        // The exit button will not render without the onCancelAndExit prop
        const exitButton = onCancelAndExit
        ? <button className="exit" onClick={onCancelAndExit}>X</button>
        : <Fragment />;

        let pickerKey = 'photo-picker-nested';
        if(containingResourceName) { pickerKey += `-in-${paramCase(containingResourceName)}s` }

        const pickerComponent = <div className="modal nested-photo-picker-frame">
            <div className="frame-heading">
                <h2>Choose a Photo</h2>
                { exitButton }
            </div>
            <ResourcePicker 
                additionalClassNames="nested"
                itemName="photo"
                key={pickerKey}
                onDataFetched={(fetchedData) => this.setState({ photoData: fetchedData })}
                onSelectedItemIdChange={(itemId) => this.setState({ selectedItemId: isNaN(itemId) === false ? itemId : null })}
                mappedPreviewAdditionalProps={mappedPreviewAdditionalProps}
                mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} />} 
                // [NOTE][HARD CODED] nonSortByFields values here are copy-pasted from ContentSectionManager (for photos)
                nonSortByFields={['file']}
                selectedItemId = { this.state.selectedItemId }
                subcomponentKey="photo"
            />
        </div>

        return <Fragment>
            <div className="modal-foreground-overlay" />
            { pickerComponent }
        </Fragment>
    }
}

export default NestedPhotoPicker

