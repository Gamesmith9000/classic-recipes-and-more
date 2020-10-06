class Recipe < ApplicationRecord
    # [NOTE: Recipe model has no validations or defaults]
    has_many :sections
end
