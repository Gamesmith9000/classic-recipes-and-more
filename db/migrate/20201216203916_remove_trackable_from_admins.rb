class RemoveTrackableFromAdmins < ActiveRecord::Migration[6.0]
  def change
    remove_column :admins, :sign_in_count
    remove_column :admins, :current_sign_in_at
    remove_column :admins, :last_sign_in_at
    remove_column :admins, :current_sign_in_ip
    remove_column :admins, :last_sign_in_ip 
  end
end
