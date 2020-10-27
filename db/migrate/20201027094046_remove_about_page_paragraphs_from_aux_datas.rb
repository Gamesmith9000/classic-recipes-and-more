class RemoveAboutPageParagraphsFromAuxDatas < ActiveRecord::Migration[6.0]
  def change
    remove_column :aux_datas, :about_page_paragraphs
  end
end
