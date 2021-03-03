class OrderedPhoto < ApplicationRecord
    belongs_to :aux_data, optional: true
    belongs_to :instruction, optional: true
    belongs_to :photo

    validates :photo_id, presence: true, numericality: { only_integer: true, greater_than: 0 }
    validates :ordinal, presence: true, numericality: { only_integer: true }
end
