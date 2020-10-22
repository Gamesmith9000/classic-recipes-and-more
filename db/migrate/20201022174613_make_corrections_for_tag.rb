class MakeCorrectionsForTag < ActiveRecord::Migration[6.0]
  def change
    add_column :photos, :tag, :string
    remove_column :recipes, :tag
  end
end
