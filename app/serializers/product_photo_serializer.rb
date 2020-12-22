class ProductPhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :tag, :title
  belongs_to :product
end
