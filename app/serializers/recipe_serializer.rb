class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ingredients, :paragraphs, :sections, :title
  has_many :sections
end
