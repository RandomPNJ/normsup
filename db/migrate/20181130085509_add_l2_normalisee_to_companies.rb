class AddL2NormaliseeToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :l2_normalisee, :string
  end
end
