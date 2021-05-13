class AuxDataSerializer
  include JSONAPI::Serializer
  has_many :about_sections
  has_many :ordered_photos
end
