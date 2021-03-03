class ChangeAssociations < ActiveRecord::Migration[6.0]
  def change
    change_table :instructions do |t|
      t.belongs_to :recipe, index: true, foreign_key: true
      t.references :ordered_photo
    end
  
    change_table :photos do |t|
      t.references :ordered_photo
    end
  
    change_table :recipes do |t|
      t.references :photo
      t.references :instruction
    end
  end
end
