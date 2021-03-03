class RemoveOrderedPhotosOrdinalDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :ordered_photos, :ordinal, nil
  end
end
