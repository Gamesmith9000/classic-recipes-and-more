class CreateProductPhotos < ActiveRecord::Migration[6.0]
  def change
    create_table :product_photos do |t|
      t.string :file
      t.string :tag
      t.string :title
      
      t.timestamps
    end
  end
end
