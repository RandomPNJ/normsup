class AddL3NormaliseeToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :l3_normalisee, :string
  end
end
