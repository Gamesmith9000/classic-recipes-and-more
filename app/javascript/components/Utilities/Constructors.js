//[NOTE][REFACTOR] Consider replacing AboutSectionData & RecipeFormIngredientData with a single
//                  constructor, as they share, & are unlikelu to have changes too, their structures.
//                  Maybe something like TextSectionData, or TextSectionWithId, etc.

export function AboutSectionData (localId, textContent) {
    this.localId = localId;
    this.textContent = textContent;
}

export function ExportedPhotoPickerState (isOpen, selectedPhotoId, selectedPhotoUrl) {
    this.isOpen = isOpen;
    this.selectedPhotoId = selectedPhotoId;
    this.selectedPhotoUrl = selectedPhotoUrl;
}

export function RecipeFormIngredientData (localId, textContent) {
    this.localId = localId;
    this.textContent = textContent;
}

export function RecipeFormRecipeState (description, featured, ingredients, previewPhotoId, 
    previewPhotoUrl, sections, title
) {
    this.description = description,
    this.featured = featured,
    this.ingredients = ingredients,
    this.previewPhotoId = previewPhotoId,
    this.previewPhotoUrl = previewPhotoUrl,
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
