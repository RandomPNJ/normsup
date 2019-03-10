class AddL2DeclareeToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :l2_declaree, :string
  end
end
