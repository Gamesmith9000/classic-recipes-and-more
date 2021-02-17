class Instruction < ApplicationRecord
    belongs_to :recipe
    has_many :ordered_photos
    has_many :photos, through: :ordered_photos
end
