import { camelCase } from 'change-case'

export function ExportedPhotoPickerState (isOpen, selectedPhotoId, selectedPhotoUrl, locationId = 0) {
    this.isOpen = isOpen;
    this.locationId = locationId;
    this.selectedPhotoId = selectedPhotoId;
    this.selectedPhotoUrl = selectedPhotoUrl;
}

export function NestedPhotoPickerTarget (descriptor, listIndex) {
    this.descriptor = typeof(descriptor) === 'string' ? camelCase(descriptor) :descriptor;
    const parsedListIndex = parseInt(listIndex);
    this.listIndex = isNaN(parsedListIndex) === false ? parsedListIndex : null;
}

export function RecipeFormSectionState (id, localId, ordered_photo_ids, recipeId, text_content) {
    // Note the use of the snake case to easy conversion for back-end.
    // Several pieces of data are retained which aid in form submission
    //  (i.e. when using from mapRecipeSectionsData)

    this.id = id;
    this.localId = localId,
    this.ordered_photo_ids = ordered_photo_ids,
    this.recipe_id = recipeId,
    this.text_content = text_content   
}

export function PhotoGalleryPageFormPhotoInfo (localId, photoId) {
    this.localId = localId;
    this.photoId = photoId;
}

export function TextSectionWithId (localId, textContent) {
    this.localId = localId;
    this.textContent = textContent;
}
