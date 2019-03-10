class AddCtonetToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :ctonet, :string
  end
end
