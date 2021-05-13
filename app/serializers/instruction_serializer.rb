class InstructionSerializer
  include JSONAPI::Serializer
  attributes :content, :ordinal
  belongs_to :recipe
  has_many :ordered_photos
  # has_many :photos, through: :ordered_photos
end
