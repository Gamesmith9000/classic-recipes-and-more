class AddOrdinalToInstructions < ActiveRecord::Migration[6.0]
  def change
    add_column :instructions, :ordinal, :integer
  end
end
