class ProductSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :price, :stock, :title, :total_sold, :product_photo_id
  has_one :product_photo
end
