import React, { Fragment } from 'react'

import VersionedPhoto from '../../../Misc/VersionedPhoto'
import BackendConstants from '../../../Utilities/BackendConstants'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues } from '../../../Utilities/Helpers'


class PhotoUpsertFormUi extends React.Component {
    isExistingPhotoWithChanges = () => {
        const { parentState } = this.props;
        if(parentState.isExistingItem !== true) { return false; }
        return !objectsHaveMatchingValues(parentState.current, parentState.prior);
    }

    validationErrorsIfPresent = (propertyName) => {
        if(!propertyName) { return null; }

        const errorsObject = this.props.parentState?.errors;
        const hasErrors = errorsObject && errorsObject[propertyName] && errorsObject[propertyName].length > 0;
        if(hasErrors === false) { return null; }
        return <ValidationErrorDisplay 
            errorsObject={errorsObject}
            propertyName={propertyName}
        />;
    }
    
    render() {
        const { allowSubmit, onClose, parentState, selectedItemId } = this.props;
        const { onFormSubmit, onUpdateCurrentFromEvent } = this.props;

        const renderTitle = <Fragment>
            <label>
                Title
                <input 
                    className="title-input"
                    maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                    onChange={(event) => onUpdateCurrentFromEvent(event, 'title')}
                    type="text"
                    value={parentState.current.title}
                />
                { this.validationErrorsIfPresent('title') }
            </label>
            <br />
        </Fragment>

        const renderFormButtons = <Fragment>
            <hr />
            <button disabled={allowSubmit === false} onClick={onFormSubmit}>
                {parentState.isExistingItem === true ? 'Update' : 'Create'}
            </button>
            <button onClick={(selectedItemId) => onClose(selectedItemId)}>Close</button>
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
                    { renderFormButtons }
                </Fragment>
            </form>
        )
    }
}

export default PhotoUpsertFormUi