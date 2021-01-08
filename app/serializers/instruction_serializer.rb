class InstructionSerializer
  include FastJsonapi::ObjectSerializer
  attributes :content, :recipe_id
  belongs_to :recipe
end
