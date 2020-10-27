class AddPhotoTagsToAuxDatas < ActiveRecord::Migration[6.0]
  def change
    add_column :aux_datas, :photoTags, :string, array: true, default: ['DEFAULT']
  end
end
