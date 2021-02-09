class AddRecipeIdToPhotos < ActiveRecord::Migration[6.0]
  def change
    add_column :photos, :recipe_id, :integer
  end
end
