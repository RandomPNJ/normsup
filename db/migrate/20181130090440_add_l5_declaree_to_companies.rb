class AddL5DeclareeToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :l5_declaree, :string
  end
end
