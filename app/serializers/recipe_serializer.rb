class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ingredients, :paragraphs, :title
  has_many :sections
end
