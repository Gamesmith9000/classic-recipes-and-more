class InstructionSerializer
  include FastJsonapi::ObjectSerializer
  attributes :content, :ordinal, :recipe_id
  belongs_to :recipe
end
