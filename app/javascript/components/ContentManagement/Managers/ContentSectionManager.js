import React, { Fragment } from 'react'

import PageManager from './PageManager'
import PhotoManager from './PhotoManager'
import ResourceManager from './ResourceManager'
import ResourceDestroyer from '../Destroyers/ResourceDestroyer'

import MappedRecipePreviewUi from '../Pickers/Subcomponents/MappedRecipePreviewUi'
import RecipeDestroyerUi from '../Destroyers/Subcomponents/RecipeDestroyerUi'
import RecipeUpsertForm from '../Forms/RecipeUpsertForm'

import ContentSectionPicker from '../Pickers/ContentSectionPicker'
import ProductUpsertForm from '../Forms/ProductUpsertForm'
import MappedProductPreviewUi from '../Pickers/Subcomponents/MappedProductPreviewUi'
import MappedPhotoPreviewUi from '../Pickers/Subcomponents/MappedPhotoPreviewUi'
import PhotoDestroyerUi from '../Destroyers/Subcomponents/PhotoDestroyerUi'
import PhotoUpsertForm from '../Forms/PhotoUpsertForm'


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
                <ContentSectionPicker 
                    allSectionNames={ContentSectionsInfo.allSectionNames()}
                    changeContentSection={(newSectionId) => this.tryChangeContentSection(newSectionId)}
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
            mappedPreviewUiComponent={(previewProps, key) => <MappedRecipePreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['ingredients', 'preview_photo_id']}
            upsertFormComponent={(upsertProps) => <RecipeUpsertForm {...upsertProps} previewPhotoVersion="small" />}
        /> } },
        { name: 'Photos',           renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
        { name: 'Photos (Updated)', renderComponent: function (props) { return <ResourceManager    
            {...props} 
            destroyerUiComponent={(destoyerUiProps) => <PhotoDestroyerUi {...destoyerUiProps} />}
            itemName="photo"
            key="photo"
            mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['file']}
            upsertFormComponent={(upsertProps) => <PhotoUpsertForm {...upsertProps} previewPhotoVersion="small" />}
        /> } },
        { name: 'Product Photos',   renderComponent: function (props) { return <PhotoManager    {...props} key="p-photo"  uploaderNamePrefix ="productPhoto" /> } },
        { name: 'Products',         renderComponent: function (props) { return <ResourceManager 
            {...props} 
            itemName="product"
            key="product"
            mappedPreviewUiComponent={(previewProps, key) => <MappedProductPreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['product_photo_id']}
            upsertFormComponent={(upsertProps) => <ProductUpsertForm {...upsertProps} />}
        /> } }
    ]
}