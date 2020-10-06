class AuxDataSerializer
  include FastJsonapi::ObjectSerializer
  attributes :about_page_sections, :photo_page_ordered_ids 
end
