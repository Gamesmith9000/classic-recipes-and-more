class RecipeSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :featured, :ingredients, :photo_id, :preview_photo_id, :title
  has_one :photo
  has_many :instructions
  has_many :sections
end
