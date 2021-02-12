class RecipeSerializer
  include JSONAPI::Serializer
  attributes :description, :featured, :ingredients, :photo_id, :title
  has_one :photo
  has_many :instructions
end
