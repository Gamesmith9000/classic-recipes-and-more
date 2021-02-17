class AuxDataSerializer
  include JSONAPI::Serializer
  attributes :about_page_sections, :photo_page_ordered_ids 
  has_many :ordered_photos
  has_many :photos, through: :ordered_photos
end
