class CreateOrderedPhotos < ActiveRecord::Migration[6.0]
  def change
    create_table :ordered_photos do |t|
      t.integer :ordinal, default: 0
      t.belongs_to :aux_data, index: true, foreign_key: true
      t.belongs_to :instruction, index: true, foreign_key: true
      t.belongs_to :photo, index: true, foreign_key: true

      t.timestamps
    end
  end
end
