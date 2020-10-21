class AddTagToPhotos < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :tag, :string
  end
end
