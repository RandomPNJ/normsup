class AddEsasec1nToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :esasec1n, :string
  end
end
