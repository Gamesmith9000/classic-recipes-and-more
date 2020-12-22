class Photo < ApplicationRecord
    validates :file, :tag, :title presence: true
    validates_length_of :tag, minimum: 1, maximum: 40, allow_blank: false
    validates_length_of :title, minimum: 2, maximum: 25, allow_blank: false
    mount_uploader :file, PhotoUploader
end
