class RemoveParagraphsFromRecipes < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :paragraphs
  end
end
