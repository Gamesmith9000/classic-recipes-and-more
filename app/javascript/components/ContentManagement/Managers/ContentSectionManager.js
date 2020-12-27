import React, { Fragment } from 'react'

import PageManager from './PageManager'
import PhotoManager from './PhotoManager'
import RecipeManager from './RecipeManager'
import ResourceManager from './ResourceManager'
import ResourceDestroyer from '../Destroyers/ResourceDestroyer'

import MappedRecipePreview from '../Pickers/Subcomponents/MappedRecipePreview'
import RecipeDestroyerUi from '../Destroyers/Subcomponents/RecipeDestroyerUi'
import RecipeForm from '../Forms/RecipeForm'
import RecipeUpsertForm from '../Forms/RecipeUpsertForm'

import SectionPicker from '../Pickers/SectionPicker'

class ContentSectionManager extends React.Component {
    constructor(props) {
        super();
    }

    tryChangeContentSection = (newSectionIdentifier) => {
        const newSectionId = parseInt(newSectionIdentifier);
        if(ContentSectionsInfo.isValidSectionId(newSectionId) === false) { return; } 

        this.props.changeContentSection(newSectionId);
        // this.setState({
        //     contentSectionOpen: true,
        //     selectedContentSection: newSectionId
        // });
    }

    render() {
        const { closeContentSection, contentSectionOpen, selectedContentSection} = this.props;

        return (
            <Fragment>
                <SectionPicker 
                    allSectionNames={ContentSectionsInfo.allSectionNames()}
                    changeContentSection={(newSectionId) => this.tryChangeContentSection(newSectionId)}
                    closeContentSection={closeContentSection}      
                    contentSectionOpen={contentSectionOpen}
                    selectedContentSection={selectedContentSection}
                />

                <hr />
                { contentSectionOpen === true &&
                    <Fragment>
                        { ContentSectionsInfo.sections[selectedContentSection].renderComponent({ photoPickerPhotoVersion: "thumb" }) }
                    </Fragment>
                }
            </Fragment>
        );
    }
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
            // alternateDeleteUrl
            // alternateIndexUrl
            // alternateShowUrl
            // alternateUpdateUrl
            destroyerUiComponent={(destoyerUiProps) => <RecipeDestroyerUi {...destoyerUiProps} />}
            itemName="recipe"
            key="recipe-manager"
            mappedItemPreviewComponent={(previewProps, key) => <MappedRecipePreview {...previewProps} key={key} /> } 
            nonSortByFields={['ingredients', 'preview_photo_id']}
            upsertFormComponent={(upsertProps) => <RecipeUpsertForm {...upsertProps} />}
        /> } },
        { name: 'Photos',           renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
        { name: 'Product Photos',   renderComponent: function (props) { return <PhotoManager    {...props} key="p-photo"  uploaderNamePrefix ="productPhoto" /> } },
        { name: 'Products',         renderComponent: function (props) { return <ResourceManager 
            {...props} 
            itemName="product"
            key="product"
        /> } }
    ]
}