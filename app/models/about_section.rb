class AboutSection < ApplicationRecord
    belongs_to :aux_data
    has_many :ordered_photos
end
