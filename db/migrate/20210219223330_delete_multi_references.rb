class DeleteMultiReferences < ActiveRecord::Migration[6.0]
  def change
    change_table :instructions do |t|
      t.remove :ordered_photo_id
    end
  
    change_table :photos do |t|
      t.remove :ordered_photo_id
    end
  
    change_table :recipes do |t|
      t.remove :instruction_id
    end
  end
end
