class Photo < ApplicationRecord
    # validates :file, presence: true
    # [TASK] Once image (file) is able to be passed, add validation back in
    validates :url, presence: true
    mount_uploader :file, PhotoUploader
end
