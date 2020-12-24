import React, { Fragment } from 'react'
import { sentenceCase } from 'change-case'

import { isValuelessFalsey, validationErrorsToString } from './Helpers'
import PageManager from '../ContentManagement/Managers/PageManager'
import PhotoManager from '../ContentManagement/Managers/PhotoManager'
import RecipeManager from '../ContentManagement/Managers/RecipeManager'
import ResourceManager from '../ContentManagement/Managers/ResourceManager'

import MappedRecipePreview from '../ContentManagement/Pickers/Subcomponents/MappedRecipePreview'
import ProductManager from '../ContentManagement/Managers/ProductManager'

export const ContentSectionsInfo = {
    isValidSectionId: function (newSectionIdentifier) {
        if(Number.isInteger(newSectionIdentifier) === false || newSectionIdentifier < 0 || newSectionIdentifier > this.sections.length -1) {
            return false
        }
        else { return true; }
    },
    // [NOTE][OPTIMIZE] Verify performance of below items. Might need optimization
    sections: [
        { name: 'Pages',            renderComponent: function (props) { return <PageManager     {...props} /> } },
        { name: 'Recipes',          renderComponent: function (props) { return <ResourceManager {...props} 
            itemName="recipe"
            key="recipe"
            mappedItemPreviewComponent={(previewProps) => <MappedRecipePreview {...previewProps} /> } 
            nonSortByFields={['ingredients', 'preview_photo_id']}
        /> } },
        { name: 'Photos',           renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
        { name: 'Product Photos',   renderComponent: function (props) { return <PhotoManager    {...props} key="p-photo"  uploaderNamePrefix ="productPhoto" /> } },
        { name: 'Products',         renderComponent: function (props) { return <ResourceManager {...props} 
            itemName="product"
            key="product"
            // mappedItemPreviewComponent=
        /> } }
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

