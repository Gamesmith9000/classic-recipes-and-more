class ChangeOrderedPhotoAssociationsToPolymorphic < ActiveRecord::Migration[6.0]
  def change
    change_table :ordered_photos do |t|
      t.remove :aux_data_id
      t.remove :instruction_id
      t.references :ordered_imageable, polymorphic: true, index: { name: :index_ordered_photos_on_ordered_imageable_type_and_id }
    end
  end
end
