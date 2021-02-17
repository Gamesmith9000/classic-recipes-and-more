class OrderedPhoto < ApplicationRecord
    belongs_to :aux_data
    belongs_to :instruction
    belongs_to :photo
end
