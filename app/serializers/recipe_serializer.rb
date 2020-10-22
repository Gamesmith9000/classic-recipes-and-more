class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :ingredients, :title
  has_many :sections
end
