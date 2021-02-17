class RemoveIds < ActiveRecord::Migration[6.0]
  def change
    remove_column :instructions, :recipe_id
    remove_column :recipes, :photo_id
  end
end
