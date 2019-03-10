class AddEnseigneToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :enseigne, :string
  end
end
