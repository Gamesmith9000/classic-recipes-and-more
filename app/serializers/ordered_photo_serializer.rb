class OrderedPhotoSerializer
  include JSONAPI::Serializer
  attributes :ordinal

  belongs_to :aux_data
  belongs_to :instruction
  belongs_to :photo
end
