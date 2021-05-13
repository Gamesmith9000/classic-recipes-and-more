class OrderedPhoto < ApplicationRecord
    belongs_to :ordered_imageable, polymorphic: true
    belongs_to :photo

    validates :ordinal, presence: true, numericality: { only_integer: true, greater_than: -1 }
    validates :photo_id, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
