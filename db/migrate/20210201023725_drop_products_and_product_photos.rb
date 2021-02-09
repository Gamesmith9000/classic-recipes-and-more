class DropProductsAndProductPhotos < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key "product_photos", "products"
    remove_foreign_key "products", "product_photos"

    drop_table :products
    drop_table :product_photos
  end
end
