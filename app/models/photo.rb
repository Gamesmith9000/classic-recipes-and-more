class Photo < ApplicationRecord
    has_many :ordered_photos
    has_many :recipes
    # has_many :aux_datas, though: :ordered_photos

    validates :file, :tag, :title, presence: true
    validates_length_of :tag, minimum: 1, maximum: 40, allow_blank: false
    validates_length_of :title, minimum: 2, maximum: 25, allow_blank: false
    mount_uploader :file, PhotoUploader
end
