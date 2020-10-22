class AddDefaultValuesForRecipePreviewPhotoId < ActiveRecord::Migration[6.0]
  def change
    change_column_default :recipes, :preview_photo_id, nil
  end
end
