class Recipe < ApplicationRecord
    validates :ingredients, presence: true
    validates :title, presence: true
    validates_length_of :title, minimum: 2, maximum: 40, allow_blank: false
    has_many :sections, -> { order('created_at DESC').reverse_order }
end
