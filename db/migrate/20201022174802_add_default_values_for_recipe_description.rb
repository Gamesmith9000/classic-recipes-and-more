class AddDefaultValuesForRecipeDescription < ActiveRecord::Migration[6.0]
  def change
    change_column_default :recipes, :description, ''
  end
end
