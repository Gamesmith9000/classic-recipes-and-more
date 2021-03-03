class AboutSectionSerializer
  include JSONAPI::Serializer
  attributes :content, :ordinal
  belongs_to :aux_data
end
