class RemoveAboutPageSectionsAndPhotoPageOrderedIdsFromAuxData < ActiveRecord::Migration[6.0]
  def change
    change_table :aux_datas do |t|
      t.remove :about_page_sections
      t.remove :photo_page_ordered_ids
    end
  end
end
