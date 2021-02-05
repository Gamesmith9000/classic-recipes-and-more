import React, { Fragment } from 'react'

import ContentOptionsContext from '../../ContentOptionsContext'

import VersionedPhoto from '../../../Misc/VersionedPhoto'
import BackendConstants from '../../../Utilities/BackendConstants'
import { UnsavedChangesDisplay, validationErrorsIfPresent } from '../../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues } from '../../../Utilities/Helpers'


class PhotoUpsertFormUi extends React.Component {
    isExistingPhotoWithChanges = () => {
        const { parentState } = this.props;
        if(parentState.isExistingItem !== true) { return false; }
        return !objectsHaveMatchingValues(parentState.current, parentState.prior);
    }
   
    render() {
        const { allowSubmit, onClose, parentState, selectedItemId } = this.props;
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

        const renderFormButtons = <Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={onFormSubmit}>
                {parentState.isExistingItem === true ? 'Update' : 'Create'}
            </button>
            <button onClick={onclose}>Close</button>
            <UnsavedChangesDisplay hasUnsavedChanges={this.isExistingPhotoWithChanges() === true}/>
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
                    { renderFormButtons }
                </Fragment>
            </form>
        )
    }
}

export default PhotoUpsertFormUi