class RemovePhotoIdFromAndAddPreviewPhotoIdToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :preview_photo_id, :integer
    remove_column :recipes, :photo_id, :integer
  end
end
