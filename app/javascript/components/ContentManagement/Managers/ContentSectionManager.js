import React, { Fragment } from 'react'

import PageManager from './PageManager'
import ResourceManager from './ResourceManager'

import ContentDashboardContext from '../ContentDashboardContext'
import PhotoDestroyerUi from '../Destroyers/Subcomponents/PhotoDestroyerUi'
import RecipeDestroyerUi from '../Destroyers/Subcomponents/RecipeDestroyerUi'
import PhotoUpsertFormUi from '../Forms/Subcomponents/PhotoUpsertFormUi'
import RecipeUpsertFormUi from '../Forms/Subcomponents/RecipeUpsertFormUi'
import ContentSectionPicker from '../Pickers/ContentSectionPicker'
import MappedPhotoPreviewUi from '../Pickers/Subcomponents/MappedPhotoPreviewUi'
import MappedRecipePreviewUi from '../Pickers/Subcomponents/MappedRecipePreviewUi'

import BackendConstants from  '../../Utilities/BackendConstants'
import { NestedPhotoPickerTarget, TextSectionWithId } from '../../Utilities/Constructors'

import PhotoManager from './PhotoManager'


export function ContentSectionManager(props) {
    const { changeContentSection, closeContentSection, contentSectionOpen, selectedContentSection} = props;

    const tryChangeContentSection = (newSectionIdentifier) => {
        const newSectionId = parseInt(newSectionIdentifier);
        if(ContentSectionsInfo.isValidSectionId(newSectionId) === false) { return; } 

        changeContentSection(newSectionId);
    }

    return (
        <ContentDashboardContext.Consumer>
            { value =>
                <Fragment>
                    <ContentSectionPicker 
                        allSectionNames={ContentSectionsInfo.allSectionNames()}
                        changeContentSection={(newSectionId) => tryChangeContentSection(newSectionId)}
                        closeContentSection={closeContentSection}
                        dashboardContext={value}
                        contentSectionOpen={contentSectionOpen}
                        selectedContentSection={selectedContentSection}
                    />
                    <hr />
                    { contentSectionOpen === true &&
                        <Fragment>
                            { ContentSectionsInfo.sections[selectedContentSection].renderComponent({ dashboardContext: value }) }
                        </Fragment>
                    }
                </Fragment>
            }
        </ContentDashboardContext.Consumer>
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
            // mappedPreviewAdditionalProps
            destroyerUiComponent={(destoyerUiProps) => <RecipeDestroyerUi {...destoyerUiProps} />}
            itemName="recipe"
            key="recipe-manager"
            mappedPreviewUiComponent={(previewProps, key) => <MappedRecipePreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['ingredients', 'photo_id']}
            upsertFormUi={(upsertProps) => <RecipeUpsertFormUi {...upsertProps} />}
            upsertFormAdditionalProps={{
                atResponseConversion: {
                    additionalItemResponseModification: function(convertedState, responseItemData) {
                        const ingredients = responseItemData.attributes.ingredients.map((value, index) => {  return (new TextSectionWithId(index, value)) });

                        convertedState.ingredients = ingredients;
                        convertedState.addedInstructionsCount = 0
                        convertedState.instructions.sort((a, b) => a.ordinal - b.ordinal);
    
                        delete convertedState.addedInstructionsCount
                        return convertedState;
                    },
                    additionalStateModification: function (convertedState, responseItemData) {
                        return {
                            addedInstructionsCount: 0,
                            nextUniqueIngredientLocalId: responseItemData.attributes.ingredients.length
                        };
                    }
                },
                createInitialState: function () {
                    const defaultRecipeState = () => { 
                        return {
                            description: '',
                            featured: BackendConstants.models.recipe.defaults.featured,
                            ingredients: [new TextSectionWithId (0, '')],
                            instructions: [{ content: '', id: -1, ordinal: 0 }],
                            title: ''
                        }
                    }
                    return {
                        addedInstructionsCount: 1,
                        associationPropertyNames: { many: ['instructions'], one: ['photo'] },
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
                preSubmit: {
                    modifyAssociations: function (associationsLists) {
                        for(let i = 0; i < associationsLists.many['instructions'].length; i++) {
                            const item = associationsLists.many['instructions'][i];
                            item.ordinal = i;
                            if(item.id < 1) { item.id = null; }
                        }
                    },
                    modifyStateData: function (currentState) {
                        const ingredients = currentState.ingredients.slice().map(value => {  return value.textContent; });
                        delete currentState.ingredient;
                        currentState.ingredients = ingredients;
                        return currentState;
                    },
                    omittedSubmitProperties: ['photo']
                },
                propertyUpdatesOnPhotoChosen: function (convertedPhotoData, currentState, photoPickerTargetState) {
                    if(photoPickerTargetState.descriptor === 'recipe') {
                        currentState.photo = convertedPhotoData;
                        currentState.photoId = convertedPhotoData.id;
                    }

                    return currentState;
                },
                useNestedPhotoPicker: true
            }}
        /> } },
        { name: 'Photos (Old)',     renderComponent: function (props) { return <PhotoManager    {...props} key="s-photo"  uploaderNamePrefix ="photo" /> } },
        { name: 'Photos (Updated)', renderComponent: function (props) { return <ResourceManager    
            {...props} 
            destroyerUiComponent={(destoyerUiProps) => <PhotoDestroyerUi {...destoyerUiProps} />}
            itemName="photo"
            key="photo"
            mappedPreviewUiComponent={(previewProps, key) => <MappedPhotoPreviewUi {...previewProps} key={key} /> } 
            nonSortByFields={['file, recipe_id']}
            upsertFormUi={(upsertProps) => <PhotoUpsertFormUi {...upsertProps} />}
            upsertFormAdditionalProps={{
                // atResponseConversion: {
                //     additionalItemResponseModification: function(convertedState, responseItemData) {
                //         delete convertedState.recipe
                //         delete convertedState.recipeId
                //         return convertedState;
                //     }
                // },
                closingWarningItemNameModifier: function (itemDisplayName) {
                    return itemDisplayName + "-data";
                },
                createInitialState: function () {
                    const defaultPhotoState = () => { 
                        return {
                            file: null,
                            tag: "DEFAULT",
                            title: ''
                        }
                    }
                    return {
                    //     associationPropertyNames: { many: [], one: [] },
                        current: defaultPhotoState(),
                        isExistingItem: false,
                        prior: defaultPhotoState()
                    }
                },
                preSubmit: {
                    convertToFormData: true,
                    finalAdditionalChanges: function (requestType, payload) {                            
                        // loop through submission data and add each item to formData
                        const formData = new FormData();
            
                        for (const [key, value] of Object.entries(payload)) {
                            if(key !== 'file' || requestType === 'post') { formData.append(`photo[${key}]`, value); }   
                        }
                        return formData;
                    }
                },
                useNestedPhotoPicker: false
            }}
        /> } }
    ]
}