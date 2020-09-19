class Photo < ApplicationRecord
    validates :file, presence: true
    validates :title, presence: true
    mount_uploader :file, PhotoUploader
end
