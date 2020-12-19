class ProductPhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :tag, :title
end
