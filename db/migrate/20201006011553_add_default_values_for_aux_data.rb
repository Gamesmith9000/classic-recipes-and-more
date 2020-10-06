class AddDefaultValuesForAuxData < ActiveRecord::Migration[6.0]
  def change
    change_column_default :aux_datas, :about_page_sections, ['']
    change_column_default :aux_datas, :photo_page_ordered_ids, []
  end
end
