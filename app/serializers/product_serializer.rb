class ProductSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :price, :stock, :title, :total_sold, :product_photo_id
  has_many :product_photos
end
