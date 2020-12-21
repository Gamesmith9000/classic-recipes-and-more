import React, { Fragment } from 'react'
import BackendConstants from '../../Utilities/BackendConstants';
import { isValuelessFalsey } from '../../Utilities/Helpers';

import PhotoDestroyer from '../Destroyers/PhotoDestroyer';
import PhotoEditForm from '../Forms/PhotoEditForm';
import PhotoUploadForm from '../Forms/PhotoUploadForm';
import PhotoPicker from '../Pickers/PhotoPicker'
import { camelCase, capitalCase, paramCase } from 'change-case';

class PhotoManager extends React.Component {
    constructor () {
        super();
        this.state = {
            photoDestroyerIsOpen: false,
            photoEditFormIsOpen: false,
            photoPickerIsOpen: true,
            photoUploadFormIsOpen: false,
            selectedPhotoId: null
        }
    }

    closeAllExceptPicker = (newId = this.state.selectedPhotoId) => {
        this.setState({
            photoDestroyerIsOpen: false,
            photoPickerIsOpen: true,
            photoEditFormIsOpen: false,
            photoUploadFormIsOpen: false,
            selectedPhotoId: newId
        });
    }

    closeAllExcept = (fieldName, newId = this.state.selectedPhotoId) => {
        let newOpenState = {
            photoDestroyerIsOpen: false,
            photoEditFormIsOpen: false,
            photoPickerIsOpen: false,
            photoUploadFormIsOpen: false,
            selectedPhotoId: newId
        }
        newOpenState[fieldName] = true;
        this.setState({
            photoDestroyerIsOpen: newOpenState.photoDestroyerIsOpen,
            photoEditFormIsOpen: newOpenState.photoEditFormIsOpen,
            photoPickerIsOpen: newOpenState.photoPickerIsOpen,
            photoUploadFormIsOpen: newOpenState.photoUploadFormIsOpen,
            selectedPhotoId: newOpenState.selectedPhotoId
        });

    };

    changeSelectedPhotoId = (newId) => {
        if(isValuelessFalsey(newId, false) === true || Number.isInteger(newId) === false) { return; }
        this.setState({ selectedPhotoId: newId });
    }

    handleAddPhotoButtonInput = (event) => {
        event.preventDefault();
        this.closeAllExcept('photoUploadFormIsOpen', null)
    }
    
    handleCloseSubcomponents = (event) => {
        if(event){ event.preventDefault(); }
        this.closeAllExceptPicker(null);
    }

    handleDeletePhotoButtonInput = (event) => {
        event.preventDefault();
        if(isValuelessFalsey(this.state.selectedPhotoId, false) === true) { return; }
        this.closeAllExcept('photoDestroyerIsOpen');
    }

    handleModifyPhotoButtonInput = (event) => {
        event.preventDefault();
        if(isValuelessFalsey(this.state.selectedPhotoId, false) === true) { return; }
        this.closeAllExcept('photoEditFormIsOpen');
    }

    render() {
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;
        const managerName = resourceName + '_manager';

        return (
            <div className={ paramCase(managerName) }>
                <h1>{ capitalCase(managerName) }</h1>
                {this.state.photoUploadFormIsOpen === false && this.state.photoDestroyerIsOpen === false && this.state.photoEditFormIsOpen === false &&
                    <Fragment>
                        <button onClick={this.handleAddPhotoButtonInput}>
                            Add Photo
                        </button>
                        <br /> 
                        <br />
                    </Fragment>
                }
                {this.state.photoPickerIsOpen === true &&
                    <PhotoPicker 
                        changeSelectedPhotoId={this.changeSelectedPhotoId}
                        handleDeletePhotoButtonInput={this.handleDeletePhotoButtonInput}
                        handleModifyPhotoButtonInput={this.handleModifyPhotoButtonInput}
                        photoPickerPhotoVersion={this.props.photoPickerPhotoVersion}
                        selectedPhotoId={this.state.selectedPhotoId}
                        uploaderNamePrefix={camelCase(resourceName)}
                    />
                }
                {this.state.photoUploadFormIsOpen === true &&
                    <PhotoUploadForm 
                        handleClose={this.handleCloseSubcomponents} 
                        uploaderNamePrefix={camelCase(resourceName)}
                    />
                }
                {this.state.photoEditFormIsOpen === true &&
                    <PhotoEditForm 
                        handleClose={this.handleCloseSubcomponents}
                        photoId={this.state.selectedPhotoId}
                        previewPhotoSize="medium"
                        uploaderNamePrefix={camelCase(resourceName)}
                    />
                }
                {this.state.photoDestroyerIsOpen === true &&
                    <PhotoDestroyer
                        handleClose={this.handleCloseSubcomponents}
                        photoId={this.state.selectedPhotoId}
                        previewPhotoSize="medium"
                        uploaderNamePrefix={camelCase(resourceName)}
                    />
                }
            </div>
        )
    }
}

export default PhotoManager
