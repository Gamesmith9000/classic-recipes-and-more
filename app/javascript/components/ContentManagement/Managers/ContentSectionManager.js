import React, { Fragment } from 'react'

import PageManager from './PageManager'
import ResourceManager from './ResourceManager'

import PhotoDestroyerUi from '../Destroyers/Subcomponents/PhotoDestroyerUi'
import RecipeDestroyerUi from '../Destroyers/Subcomponents/RecipeDestroyerUi'
import PhotoUpsertForm from '../Forms/PhotoUpsertForm'
import RecipeUpsertForm from '../Forms/RecipeUpsertForm'
import ContentSectionPicker from '../Pickers/ContentSectionPicker'
import MappedPhotoPreviewUi from '../Pickers/Subcomponents/MappedPhotoPreviewUi'
import MappedRecipePreviewUi from '../Pickers/Subcomponents/MappedRecipePreviewUi'

import PhotoManager from './PhotoManager'


export function ContentSectionManager(props) {
    const { changeContentSection, closeContentSection, contentSectionOpen, selectedContentSection} = props;

    const tryChangeContentSection = (newSectionIdentifier) => {
        const newSectionId = parseInt(newSectionIdentifier);
        if(ContentSectionsInfo.isValidSectionId(newSectionId) === false) { return; } 

        changeContentSection(newSectionId);
    }

    return (
        <Fragment>
            <ContentSectionPicker 
                allSectionNames={ContentSectionsInfo.allSectionNames()}
                changeContentSection={(newSectionId) => tryChangeContentSection(newSectionId)}
                closeContentSection={closeContentSection}      
                contentSectionOpen={contentSectionOpen}
                selectedContentSection={selectedContentSection}
            />

            <hr />
            { contentSectionOpen === true &&
                <Fragment>
                    { ContentSectionsInfo.sections[selectedContentSection].renderComponent() }
                </Fragment>
            }
        </Fragment>
    );
}

export default ContentSectionManager;

const ContentSectionsInfo = {
    allSectionNames: function () {
        const mappedNames = ContentSectionsInfo.sections.map(function(item) { return item.name } );
        return mappedNames;
    },
    isValidSectionId: function (newSectionIdentifier) {
        if(Number.isInteger(newSectionIdentifier) === false || newSectionIdentifier < 0 || newSectionIdentifier > this.sections.length -1) {
            return false
        }
        else { return true; }
    },
    // [NOTE][OPTIMIZE] Verify performance of below items. Might need optimization
    sections: [
        { name: 'Pages',            renderComponent: function (props) { return <PageManager     {...props} /> } },
        { name: 'Recipes',          renderComponent: function (props) { return <ResourceManager 
            {...props} 
            // additionalMappedItemPreviewProps
            destroyerUiComponent={(destoyerUiProps) => <RecipeDestroyerUi {...destoyerUiProps} />}
            itemName="recipe"
            key="recipe-manager"
            mappedPreviewUiComponent={(previewProps, key) => <MappedRecipePreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['ingredients', 'preview_photo_id']}
            upsertFormComponent={(upsertProps) => <RecipeUpsertForm {...upsertProps} previewPhotoVersion="small" />}
        /> } },
        { name: 'Photos (Old)',           renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
        { name: 'Photos (Updated)', renderComponent: function (props) { return <ResourceManager    
            {...props} 
            destroyerUiComponent={(destoyerUiProps) => <PhotoDestroyerUi {...destoyerUiProps} />}
            itemName="photo"
            key="photo"
            mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['file']}
            upsertFormComponent={(upsertProps) => <PhotoUpsertForm {...upsertProps} previewPhotoVersion="small" />}
        /> } }
    ]
}