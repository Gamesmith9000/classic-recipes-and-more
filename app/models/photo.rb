class Photo < ApplicationRecord
    validates :file, presence: true
    mount_uploader :file, PhotoUploader
end
