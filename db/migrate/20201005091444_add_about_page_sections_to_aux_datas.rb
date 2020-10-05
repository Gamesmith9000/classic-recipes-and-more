class AddAboutPageSectionsToAuxDatas < ActiveRecord::Migration[6.0]
  def change
    add_column :aux_datas, :about_page_sections, :text, array: true
  end
end
