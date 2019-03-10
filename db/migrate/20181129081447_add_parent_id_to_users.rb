class AddParentIdToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :first_name, :string, default: ''
    add_column :users, :last_name, :string, default: ''
    add_column :users, :parent_id, :integer, foreign_key: true
    add_reference :users, :user_role, foreign_key: true
  end
end
