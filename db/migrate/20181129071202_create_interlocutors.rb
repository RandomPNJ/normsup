class CreateInterlocutors < ActiveRecord::Migration[5.1]
  def change
    create_table :interlocutors do |t|
      t.string :first_name, default: ''
      t.string :last_name, default: ''
      t.boolean :man, default: false
      t.string :email, default: ''
      t.string :position, default: ''
      t.boolean :privileged, default: true
      t.references :company, foreign_key: true
      t.references :supplier, foreign_key: true
      t.timestamps
    end
  end
end
