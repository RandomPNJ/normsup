class AddL3DeclareeToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :l3_declaree, :string
  end
end
