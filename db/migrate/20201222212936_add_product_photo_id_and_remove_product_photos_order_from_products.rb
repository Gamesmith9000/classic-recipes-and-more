class AddProductPhotoIdAndRemoveProductPhotosOrderFromProducts < ActiveRecord::Migration[6.0]
  def change
    add_reference :products, :product_photo, foreign_key: true
    remove_column :products, :product_photos_order
  end
end
