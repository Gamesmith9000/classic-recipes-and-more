class Recipe < ApplicationRecord
    # [NOTE: Recipe model has no validations or defaults]
    has_many :sections, -> { order('created_at DESC').reverse_order }
end
