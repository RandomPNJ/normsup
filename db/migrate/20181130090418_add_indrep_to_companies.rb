class AddIndrepToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :indrep, :string
  end
end
