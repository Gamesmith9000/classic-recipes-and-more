class CreateAboutSections < ActiveRecord::Migration[6.0]
  def change
    create_table :about_sections do |t|
      t.text :content, default: ""
      t.integer :ordinal, default: 0
      t.belongs_to :aux_data, index: true, foreign_key: true
      t.timestamps
    end
  end
end
