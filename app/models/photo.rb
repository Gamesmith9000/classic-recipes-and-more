class Photo < ApplicationRecord
    validates :file, presence: true
    validates :title, presence: true
    validates_length_of :title, minimum: 2, maximum: 40, allow_blank: false
    mount_uploader :file, PhotoUploader
end
