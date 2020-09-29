class AuxDataSerializer
  include FastJsonapi::ObjectSerializer
  attributes :about_page_paragraphs, :photo_page_ordered_ids 
end
