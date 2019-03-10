class AddEsaapenToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :esaapen, :string
  end
end
