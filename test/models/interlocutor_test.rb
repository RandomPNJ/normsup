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

require 'test_helper'

class InterlocutorTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
