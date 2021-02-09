class RemovePreviewPhotoIdFromRecipes < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :preview_photo_id
  end
end
