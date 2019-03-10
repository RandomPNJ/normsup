class AddLibtcaToCompanies < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :libtca, :string
  end
end
