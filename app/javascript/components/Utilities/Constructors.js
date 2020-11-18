export function ExportedPhotoPickerState (isOpen, selectedPhotoId, selectedPhotoUrl, locationId = 0) {
    this.isOpen = isOpen;
    this.locationId = locationId;
    this.selectedPhotoId = selectedPhotoId;
    this.selectedPhotoUrl = selectedPhotoUrl;
}

export function RecipeFormRecipeState (description, featured, ingredients, previewPhotoId, sections, title) {
    this.description = description,
    this.featured = featured,
    this.ingredients = ingredients,
    this.previewPhotoId = previewPhotoId,
    this.sections = sections,
    this.title = title
}

export function RecipeFormSectionState (id, ordered_photo_ids, recipeId, text_content) {
    // Note the use of the snake case to easy conversion for back-end

    this.id = id,
    this.ordered_photo_ids = ordered_photo_ids,
    this.recipeId = recipeId,
    this.text_content = text_content   
}

export function TextSectionWithId (localId, textContent) {
    this.localId = localId;
    this.textContent = textContent;
}
