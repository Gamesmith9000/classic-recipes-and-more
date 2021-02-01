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

import BackendConstants from  '../../Utilities/BackendConstants'
import { NestedPhotoPickerTarget, TextSectionWithId } from '../../Utilities/Constructors'

import RecipeUpsertFormUi2 from '../Forms/Subcomponents/RecipeUpsertFormUi2'

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
            upsertFormUiComponent={(upsertProps) => <RecipeUpsertFormUi2 {...upsertProps} previewPhotoVersion="small" />}
            upsertFormAdditionalProps={{
                additionalResponseToStateConversion: function(convertedState, responseItemData) {
                    const ingredients = responseItemData.attributes.ingredients.map((value, index) => {  return (new TextSectionWithId(index, value)) });

                    convertedState.ingredients = ingredients;
                    convertedState.addedInstructionsCount = 0
                    convertedState.instructions.sort((a, b) => a.ordinal - b.ordinal);

                    delete convertedState.addedInstructionsCount
                    return convertedState;
                },
                additionalStateChangesDuringResponseConversion: function (convertedState, responseItemData) {
                    return {
                        addedInstructionsCount: 0,
                        nextUniqueIngredientLocalId: responseItemData.attributes.ingredients.length
                    };
                },
                createInitialState: function () {
                    const defaultRecipeState = () => { 
                        return {
                            description: '',
                            errors: {},
                            featured: BackendConstants.models.recipe.defaults.featured,
                            ingredients: [new TextSectionWithId (0, '')],
                            instructions: [{ content: '', id: -1, ordinal: 0 }],
                            title: ''
                        }
                    }
                    return {
                        addedInstructionsCount: 1,
                        associationPropertyNames: { many: [], one: [] },
                        current: defaultRecipeState(),
                        isExistingItem: false,
                        nextUniqueIngredientLocalId: 1,
                        photoPickerIsOpen: false,
                        photoPickerTarget: new NestedPhotoPickerTarget(null, null),
                        prior: defaultRecipeState()
                    }
                },
                onAddListItem: {
                    ingredient: function (stateCopy, listCopy) {
                        const nextId = stateCopy.nextUniqueIngredientLocalId;
                        listCopy.push(new TextSectionWithId(nextId, ''));
                        stateCopy.current.ingredients = listCopy;
                        stateCopy.nextUniqueIngredientLocalId = nextId + 1;
                        return stateCopy;
                    },
                    instruction: function (stateCopy, listCopy) {
                        const nextId = (stateCopy.addedInstructionsCount + 1) * -1;
                        listCopy.push({ content: '', id: nextId, ordinal: null });
                        stateCopy.current.instructions = listCopy;
                        stateCopy.addedInstructionsCount = -nextId;
                        return stateCopy;
                    }
                },
                propertyUpdatesOnPhotoChosen : function (convertedPhotoData, currentState, photoPickerTargetState) {
                    if(photoPickerTargetState.descriptor === 'recipe') {
                        currentState.photo = convertedPhotoData;
                        currentState.photoId = convertedPhotoData.id;
                    }

                    return currentState;
                }
            }}
        /> } },
        { name: 'Photos (Old)',     renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
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