class CreateAuxDatas < ActiveRecord::Migration[6.0]
  def change
    create_table :aux_datas do |t|
      t.text :about_page_paragraphs, array: true
      t.integer :photo_page_ordered_ids, array: true

      t.timestamps
    end
  end
end
