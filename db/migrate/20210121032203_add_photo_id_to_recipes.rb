class AddPhotoIdToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :photo_id, :integer
  end
end
