class CreatePhotos < ActiveRecord::Migration[6.0]
  def change
    create_table :photos do |t|
      t.string :file
      t.string :notes
      t.string :title

      t.timestamps
    end
  end
end
