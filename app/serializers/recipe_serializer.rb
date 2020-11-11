class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :featured, :ingredients, :preview_photo_id, :title
  has_many :sections
end
