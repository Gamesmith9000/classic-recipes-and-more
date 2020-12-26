class AddProductPhotoRefToAndRemoveProductPhotosOrderFromProducts < ActiveRecord::Migration[6.0]
  def change
    add_reference :products, :product_photo, foreign_key: true
    remove_column :products, :product_photos_order, :integer, array: true
  end
end
