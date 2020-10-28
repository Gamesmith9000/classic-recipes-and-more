import React, { Fragment } from 'react'
import PhotoPicker from '../Pickers/PhotoPicker'
import PhotoUploadForm from '../Forms/PhotoUploadForm';
import PhotoEditForm from '../Forms/PhotoEditForm';

class PhotoManager extends React.Component {

    // [NOTE] Next step: Refactor this with dynamic handlers (open/close handlers, at least)

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
        if(newId && !Number.isInteger(newId)) { return; }
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
        if(!this.state.selectedPhotoId) { return; }
        this.closeAllExcept('photoDestroyerIsOpen');
    }

    handleModifyPhotoButtonInput = (event) => {
        event.preventDefault();
        if(!this.state.selectedPhotoId) { return; }
        this.closeAllExcept('photoEditFormIsOpen');
    }

    render() {
        return (
            <div className="photo-manager">
                <h1>Photo Manager</h1>
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
                        selectedPhotoId={this.state.selectedPhotoId}
                    />
                }
                {this.state.photoUploadFormIsOpen === true &&
                    <PhotoUploadForm handleClose={this.handleCloseSubcomponents} />
                }
                {this.state.photoEditFormIsOpen === true &&
                    <PhotoEditForm 
                        handleClose={this.handleCloseSubcomponents}
                        photoId={this.state.selectedPhotoId}
                        previewPhotoSize="medium"
                    />
                }
                {this.state.photoDestroyerIsOpen === true &&
                    <Fragment/>
                }
            </div>
        )
    }
}

export default PhotoManager
