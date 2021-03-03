class RecipeSerializer
  include JSONAPI::Serializer
  attributes :description, :featured, :ingredients, :title
  has_one :photo
  has_many :instructions
end
