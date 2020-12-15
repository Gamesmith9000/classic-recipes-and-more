import React, { Fragment } from 'react'

import { BackendConstants, validationErrorsToString } from './Helpers'
import PageManager from '../ContentManagement/Managers/PageManager'
import PhotoManager from '../ContentManagement/Managers/PhotoManager'
import RecipeManager from '../ContentManagement/Managers/RecipeManager'


export const ContentSectionsInfo = {
    isValidSectionId: function (newSectionIdentifier) {
        if(!Number.isInteger(newSectionIdentifier) || newSectionIdentifier < 0 || newSectionIdentifier > this.sections.length -1) {
            return false
        }
        else { return true; }
    },
    // [NOTE][OPTIMIZE] Verify performance of below items. Might need optimization
    sections: [
        { name: 'Pages',    renderComponent: function (props) { return <PageManager {...props} /> } },
        { name: 'Recipes',  renderComponent: function (props) { return <RecipeManager {...props} /> } },
        { name: 'Photos',   renderComponent: function (props) { return <PhotoManager {...props} /> } }
    ]
}

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
    const itemNameIsValid = Boolean(props?.entryTypeName);
    const itemName = itemNameIsValid === true ? String(props?.entryTypeName).toLowerCase() : entrie;
    return (
        <p className='no-entries'>
            { `No ${itemName}s have been added yet.` }
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

export function VersionedPhoto (props) {
    const { additionalStyles, photoFileData, photoVersionName, renderNullWithoutUrl, targetClassName, textDisplayForNoPhoto } = props;

    // As an alternative, photoFileData prop can be passed the url string directly

    const noFileData = (!photoFileData);
    const uploaderVersionData = BackendConstants.photoUploader.getVersionData(photoVersionName);

    const mainStyles = {
        height: uploaderVersionData.maxHeight,
        width: uploaderVersionData.maxWidth,
    }
    if(noFileData === false) { mainStyles.objectFit = "contain" }

    let additionalProps = { style: { ...mainStyles, ...additionalStyles } };
    if(targetClassName) { additionalProps.className = targetClassName; }

    if(noFileData === true) {
        if(renderNullWithoutUrl === true) { return; }
        return <div {...additionalProps}>{textDisplayForNoPhoto}</div>
    }
    else {
        const usingString = typeof(photoFileData) === 'string';
        const url = usingString === true ? photoFileData : BackendConstants.photoUploader.getUrlForVersion(photoFileData, photoVersionName);
        if(renderNullWithoutUrl === true && !url) { return; }
        return <img src={url} {...additionalProps} />;
    }
}