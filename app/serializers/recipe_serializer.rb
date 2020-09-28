class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ingredients, :paragraphs, :photo_id, :title
  has_one :photo
end
