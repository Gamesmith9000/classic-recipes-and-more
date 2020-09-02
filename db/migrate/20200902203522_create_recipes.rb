class CreateRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.string :title
      t.string :ingredients, array: true
      t.text :paragraphs, array: true

      t.timestamps
    end
  end
end
