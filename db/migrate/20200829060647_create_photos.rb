class CreatePhotos < ActiveRecord::Migration[6.0]
  def change
    create_table :photos do |t|
      t.string :file
      t.string :caption
      t.string :url

      t.timestamps
    end
  end
end
