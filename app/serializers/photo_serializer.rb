class PhotoSerializer
  include JSONAPI::Serializer
  attributes :file, :recipe_id, :tag, :title
  belongs_to :recipe
end
