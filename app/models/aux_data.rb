class AuxData < ApplicationRecord
    # [NOTE] Fields are not validated for AuxData
    has_many :about_sections
    has_many :ordered_photos, as: :ordered_imageable
end
