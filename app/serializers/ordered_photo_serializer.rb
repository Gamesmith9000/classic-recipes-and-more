class OrderedPhotoSerializer
  include JSONAPI::Serializer
  attributes :ordinal
  belongs_to :ordered_imageable, polymorphic: { AuxData => :aux_data, Instruction => :instruction, AboutSection => :about_section }
  belongs_to :photo
end
