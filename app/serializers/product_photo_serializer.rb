class ProductPhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :product_id, :tag, :title
  belongs_to :product
end
