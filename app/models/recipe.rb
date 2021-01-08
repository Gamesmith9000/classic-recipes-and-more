class Recipe < ApplicationRecord
    has_many :instructions
    has_many :sections, -> { order('created_at DESC').reverse_order }

    validates :description, presence: true
    validates_length_of :description, minimum: 5, maximum: 300, allow_blank: false
    validates :featured, inclusion: { in: [ false, true ] }
    validates :ingredients, presence: true
    validates :title, presence: true
    validates_length_of :title, minimum: 2, maximum: 40, allow_blank: false
end
