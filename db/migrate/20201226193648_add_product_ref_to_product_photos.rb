class AddProductRefToProductPhotos < ActiveRecord::Migration[6.0]
  def change
    add_reference :product_photos, :product, foreign_key: true
  end
end
