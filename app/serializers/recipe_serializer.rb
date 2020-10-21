class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :ingredients, :paragraphs, :title
  has_many :sections
end
