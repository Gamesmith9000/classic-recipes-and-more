class AboutSectionSerializer
  include JSONAPI::Serializer
  attributes :ordinal, :text_content
  belongs_to :aux_data
  has_many :ordered_photos
end
