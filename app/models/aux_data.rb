class AuxData < ApplicationRecord
    # [NOTE] Fields are not validated for AuxData

    has_many :ordered_photos
    has_many :photos, through: :ordered_photos
end
