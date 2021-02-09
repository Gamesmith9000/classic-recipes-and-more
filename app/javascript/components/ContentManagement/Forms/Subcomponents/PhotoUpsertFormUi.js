import React, { Fragment, useState } from 'react'

import ContentOptionsContext from '../../ContentOptionsContext'

import VersionedPhoto from '../../../Misc/VersionedPhoto'
import BackendConstants from '../../../Utilities/BackendConstants'
import { validationErrorsIfPresent } from '../../../Utilities/ComponentHelpers'
import { isValuelessFalsey } from '../../../Utilities/Helpers'


function PhotoUpsertFormUi(props) {
    const [uploadPreview, setUploadPreview] = useState(null);

    const { allowSubmit, onClose, parentState, selectedItemId, submissionIsProcessingWithMessage } = props;
    const { onFormSubmit, onUpdateCurrent, onUpdateCurrentFromEvent } = props;

    const renderTitle = <Fragment>
        <label>
            Title
            <input 
                className="title-input"
                maxLength={BackendConstants.models.photo.validations.title.maximum} 
                onChange={(event) => onUpdateCurrentFromEvent(event, 'title')}
                type="text"
                value={parentState.current.title}
            />
            { validationErrorsIfPresent('title', parentState?.errors) }
        </label>
        <br />
    </Fragment>

    const renderTag = <Fragment>
    <label>
        Tag
        <input 
            className="tag-input"
            maxLength={BackendConstants.models.photo.validations.tag.maximum} 
            onChange={(event) => onUpdateCurrent(event, event.target.value.toUpperCase(), 'tag')}
            type="text"
            value={parentState.current.tag}
        />
        { validationErrorsIfPresent('tag', parentState?.errors) }
    </label>
    <br />
    </Fragment>

    const renderPhotoPreview = () => {
        if(parentState.isExistingItem === false && uploadPreview) {
            return <img className="upload-preview" src={uploadPreview} />
        }
        else {
            return (
                <ContentOptionsContext.Consumer>
                    { value =>
                        <VersionedPhoto 
                            uploadedFileData={parentState.current.file}
                            uploaderNamePrefix="photo"
                            uploadedFileVersionName={value.photoPicker.standardImageVersion}
                            textDisplayForNoPhoto="(Please upload an image file)"
                        />
                    }
                </ContentOptionsContext.Consumer>
            );
        }
    }

    const updateFileStates = (event) => {
        const fileData = event.target.files[0];
        setUploadPreview(URL.createObjectURL(fileData));
        onUpdateCurrent(event, fileData, 'file');
    }

    const renderFile = <Fragment>
        <label>
        File
        <br/>
        { parentState.isExistingItem === false &&
            <Fragment>
                <input 
                    onChange={updateFileStates}
                    type="file" 
                />
                <br />
                <br />
            </Fragment>
        }
        { validationErrorsIfPresent('file', parentState?.errors) }
        { renderPhotoPreview() }
    </label>
    <br />
    </Fragment>

    const renderFormButtons = <Fragment>
        <hr />
        <button disabled={allowSubmit === false} onClick={onFormSubmit}>
            {parentState.isExistingItem === true ? 'Update' : 'Create'}
        </button>
        <button disabled={submissionIsProcessingWithMessage === true} onClick={onClose}>Close</button>
    </Fragment>

    return (
        <form className="photo-form" onSubmit={onFormSubmit}>
            <h2>{parentState.isExistingItem === true ? 'Edit' : 'New'} Photo</h2>
            <Fragment>
                { parentState.isExistingItem === true && isValuelessFalsey(selectedItemId) === false &&
                    <p>ID: {selectedItemId}</p>
                }
                { renderTitle }
                { renderTag }
                { renderFile }
                { renderFormButtons }
                { submissionIsProcessingWithMessage === true &&
                    <div className="processing-submission">Processing... Please wait.</div>
                }
            </Fragment>
        </form>
    )
}

export default PhotoUpsertFormUi