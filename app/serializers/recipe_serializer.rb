class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :featured, :ingredients, :title
  has_many :sections
end
