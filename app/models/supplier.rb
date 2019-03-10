# == Schema Information
#
# Table name: suppliers
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  company_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Supplier < ApplicationRecord
  belongs_to :user
  belongs_to :company
  has_many :interlocutors
  delegate :name, to: :company
  accepts_nested_attributes_for :interlocutors, reject_if: :all_blank, allow_destroy: true

  delegate :name, :is_valid, to: :company



end
