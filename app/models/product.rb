class Product < ApplicationRecord
    has_one :product_photo

    validates :price, :title, presence: true
    validates :stock, :total_sold, numericality: { only_integer: true}
    validates :price, numericality: { greater_than: 0 }
    validates_length_of :title, minimum: 3, maximum: 40, allow_blank: false
end
