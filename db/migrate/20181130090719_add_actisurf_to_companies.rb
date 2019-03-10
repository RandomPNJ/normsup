class AddActisurfToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :actisurf, :string
  end
end
