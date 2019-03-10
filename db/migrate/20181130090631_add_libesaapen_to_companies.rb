class AddLibesaapenToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :libesaapen, :string
  end
end
