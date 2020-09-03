class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ingredients, :paragraphs, :title
end
