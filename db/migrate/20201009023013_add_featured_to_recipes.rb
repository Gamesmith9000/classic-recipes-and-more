class AddFeaturedToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :featured, :boolean, default: false
  end
end
