class PhotoSerializer
  include JSONAPI::Serializer
  attributes :file, :tag, :title #, :recipe_id
  has_many :recipes
  has_many :ordered_photos
end
