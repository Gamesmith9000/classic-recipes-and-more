class SectionSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ordered_photo_ids, :recipe_id, :text_content
  belongs_to :recipe
end
