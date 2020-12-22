class CreateProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :products do |t|
      t.text :description
      t.float :price
      t.integer :product_photos_order, array: true
      t.integer :stock, default: 0
      t.string :title
      t.integer :total_sold, default: 0

      t.timestamps
    end
  end
end
