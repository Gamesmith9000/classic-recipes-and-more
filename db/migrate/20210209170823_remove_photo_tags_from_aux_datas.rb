class RemovePhotoTagsFromAuxDatas < ActiveRecord::Migration[6.0]
  def change
    remove_column :aux_datas, :photo_tags
  end
end
