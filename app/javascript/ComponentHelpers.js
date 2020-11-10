import React, { Fragment } from 'react'
import PageManager from './components/ContentManagement/Managers/PageManager'
import PhotoManager from './components/ContentManagement/Managers/PhotoManager'
import RecipeManager from './components/ContentManagement/Managers/RecipeManager'
import { validationErrorsToString } from './Helpers'


export const ContentSectionsInfo = {
    isValidSectionId: function (newSectionIdentifier) {
        if(!Number.isInteger(newSectionIdentifier) || newSectionIdentifier < 0 || newSectionIdentifier > this.sections.length -1) {
            return false
        }
        else { return true; }
    },
    sections: [
        {component: <PageManager/>, name: 'Pages' },
        {component: <RecipeManager/>, name: 'Recipes' },
        {component: <PhotoManager/>, name: 'Photos' }
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