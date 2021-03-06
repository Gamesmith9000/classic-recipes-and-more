import React, { Fragment } from 'react'
import { sentenceCase } from 'change-case'

import { isValuelessFalsey, validationErrorsToString } from './Helpers'

export function EmbeddedYoutubeVideo (props) {
    return (
        props?.youtubeVideoId
        ?
            <div className="video-frame">
                <iframe 
                    src={`https://www.youtube-nocookie.com/embed/${props.youtubeVideoId}`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            </div>
        :
            <Fragment />
    );
}

export function EmptyPickerEntriesDisplay (props) {
    const { entryTypeName } = props;
    const itemNameIsValid = isValuelessFalsey(entryTypeName) === false && typeof entryTypeName === 'string';
    const itemName = itemNameIsValid === true ? entryTypeName : entrie;
    return (
        <p className='no-entries'>
            { sentenceCase(`No ${itemName}s have been added yet`) + '.' }
        </p>
    );
}

export function FlashMessagesDisplay (props) {
    return (
        <div className="flash-messages">
            { flashMessages.alert &&
                <p className="flash-alert">{flashMessages.alert}</p>
            }
            { flashMessages.notice &&
                <p className="flash-notice">{flashMessages.notice}</p>
            }
        </div>
    )
}

export function validationErrorsIfPresent (propertyName, errorsObject) {
    if(!propertyName || Object.keys(errorsObject).length === 0) { return null; }

    const hasErrors = errorsObject && errorsObject[propertyName] && errorsObject[propertyName].length > 0;
    if(hasErrors === false) { return null; }
    return <ValidationErrorDisplay 
        errorsObject={errorsObject}
        propertyName={propertyName}
    />;
}

export function UnsavedChangesDisplay (props) {
    return (
        // [NOTE] a more pleasant display should be created
        <Fragment>     
            { props?.hasUnsavedChanges === true 
            ? <div className="unsaved-changes"> YOU HAVE UNSAVED CHANGES! </div>
            : <br/>
            }
        </Fragment>
    );
}

export function ValidationErrorDisplay (props) {
    const missingProps = (!props?.errorsObject?.[props.propertyName] || !props.propertyName);
    const doNotCapitalize = (props?.doNotCapitalizePropertyName === true);
    const displayName = doNotCapitalize === true ? props?.propertyName : (props?.propertyName?.charAt(0).toUpperCase() + props?.propertyName?.slice(1));

    return (
        missingProps === false
        ?
            <div className="validation-error">
                { validationErrorsToString(displayName, props.errorsObject[props.propertyName]) }
            </div>
        :
            <Fragment/>
    );
}

