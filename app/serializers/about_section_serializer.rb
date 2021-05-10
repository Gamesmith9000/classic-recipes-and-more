class AboutSectionSerializer
  include JSONAPI::Serializer
  attributes :content, :ordinal
  belongs_to :aux_data
  has_many :ordered_photos
end
