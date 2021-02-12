class InstructionSerializer
  include JSONAPI::Serializer
  attributes :content, :ordinal, :recipe_id
  belongs_to :recipe
end
