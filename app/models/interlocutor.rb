# == Schema Information
#
# Table name: interlocutors
#
#  id          :integer          not null, primary key
#  first_name  :string           default("")
#  last_name   :string           default("")
#  man         :boolean          default(FALSE)
#  email       :string           default("")
#  position    :string           default("")
#  privileged  :boolean          default(TRUE)
#  company_id  :integer
#  supplier_id :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Interlocutor < ApplicationRecord
  belongs_to :company, optional: true
  belongs_to :supplier

  before_create :set_company

  def set_company
    self.company = supplier.company
  end
end
