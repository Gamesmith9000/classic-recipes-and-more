class AddPhotoIdToRecipesAndRemoveNotesFromPhotos < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :photo_id, :integer
    remove_column :photos, :notes
  end
end
