class RecipeSerializer
  include JSONAPI::Serializer
  attributes :description, :featured, :ingredients, :title #, :photo_id 
  has_one :photo
  has_many :instructions
end
