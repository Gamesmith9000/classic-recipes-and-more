class PhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :recipe_id, :tag, :title
  belongs_to :recipe
end
