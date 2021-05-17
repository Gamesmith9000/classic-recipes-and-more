class RenameContentToTextContentInAboutSections < ActiveRecord::Migration[6.0]
  def change
    change_table(:about_sections) do |t|
      t.remove :content
      t.text :text_content
    end
  end
end
