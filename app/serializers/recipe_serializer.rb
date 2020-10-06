class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ingredients, :paragraphs, :photo_id, :sections, :title
  has_many :sections
end
