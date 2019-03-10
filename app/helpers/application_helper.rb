module ApplicationHelper
  def get_supplier_id(company)
    current_user.suppliers.find_by(company: company)
  end
end
