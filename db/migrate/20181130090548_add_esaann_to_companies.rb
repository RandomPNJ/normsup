class AddEsaannToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :esaann, :string
  end
end
