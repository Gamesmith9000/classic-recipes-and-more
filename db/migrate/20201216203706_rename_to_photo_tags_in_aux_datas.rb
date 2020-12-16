class RenameToPhotoTagsInAuxDatas < ActiveRecord::Migration[6.0]
  def change
    add_column :aux_datas, :photo_tags, :string, array: true, default: ['DEFAULT']
    remove_column :aux_datas, :photoTags
  end
end
