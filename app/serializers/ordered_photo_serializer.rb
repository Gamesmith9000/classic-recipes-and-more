class OrderedPhotoSerializer
  include JSONAPI::Serializer
  attributes :ordinal #, :aux_data_id, :instruction_id, :photo_id

  belongs_to :aux_data
  belongs_to :instruction
  belongs_to :photo
end
