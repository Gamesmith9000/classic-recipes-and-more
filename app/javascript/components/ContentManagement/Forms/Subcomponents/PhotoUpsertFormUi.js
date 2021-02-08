import React, { Fragment } from 'react'

import ContentOptionsContext from '../../ContentOptionsContext'

import VersionedPhoto from '../../../Misc/VersionedPhoto'
import BackendConstants from '../../../Utilities/BackendConstants'
import { validationErrorsIfPresent } from '../../../Utilities/ComponentHelpers'
import { isValuelessFalsey } from '../../../Utilities/Helpers'


class PhotoUpsertFormUi extends React.Component {
    render() {
        const { allowSubmit, onClose, parentState, selectedItemId, submissionIsProcessingWithMessage } = this.props;
        const { onFormSubmit, onUpdateCurrent, onUpdateCurrentFromEvent } = this.props;

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

        const renderFile = <Fragment>
            <label>
            File
            <br/>
            { parentState.isExistingItem === false &&
                <Fragment>
                    <input 
                        onChange={(event) => onUpdateCurrent(event, event.target.files[0], 'file')}
                        type="file" 
                    />
                    <br />
                    <br />
                </Fragment>
            }
            { validationErrorsIfPresent('file', parentState?.errors) }
            <ContentOptionsContext.Consumer>
                { value =>
                    <VersionedPhoto 
                        uploadedFileData={parentState?.current?.file}
                        uploaderNamePrefix="photo"
                        uploadedFileVersionName={value.photoPicker.standardImageVersion}
                        textDisplayForNoPhoto="(Please upload an image file)"
                    />
                }
                </ContentOptionsContext.Consumer>
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
}

export default PhotoUpsertFormUi