class CreateSections < ActiveRecord::Migration[6.0]
  def change
    create_table :sections do |t|
      t.integer :ordered_photo_ids, array: true
      t.integer :recipe_id
      t.text :text_content

      t.timestamps
    end
  end
end
