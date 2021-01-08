class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :featured, :ingredients, :preview_photo_id, :title
  has_many :instructions
  has_many :sections
end
