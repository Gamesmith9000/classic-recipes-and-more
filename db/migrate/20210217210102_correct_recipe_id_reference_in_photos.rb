class CorrectRecipeIdReferenceInPhotos < ActiveRecord::Migration[6.0]
  change_table :photos do |t|
    t.remove :recipe_id
    t.references :recipe
  end
end
