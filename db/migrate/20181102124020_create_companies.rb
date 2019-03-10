class CreateCompanies < ActiveRecord::Migration[5.1]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :siret
      t.datetime :invalid_at
      t.datetime :valid_at
      t.boolean :is_valid, default: false
      t.string :kbis
      t.string :urssaf
      t.string :lnte

      t.timestamps
    end
  end
end
