# == Schema Information
#
# Table name: user_roles
#
#  id         :integer          not null, primary key
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class UserRole < ApplicationRecord
  after_save :set_slug

  def set_slug
    self.slug = name.parameterize
  end
end
