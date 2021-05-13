class Instruction < ApplicationRecord
    belongs_to :recipe
    has_many :ordered_photos, as: :ordered_imageable
    # has_many :photos, through: :ordered_imageable
end
