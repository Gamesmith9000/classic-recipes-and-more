class AuxDataSerializer
  include JSONAPI::Serializer
  attributes :about_page_sections, :photo_page_ordered_ids 
end
