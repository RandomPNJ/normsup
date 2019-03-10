class AddTcaToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :tca, :string
  end
end
