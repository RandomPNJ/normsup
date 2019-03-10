# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  company_id             :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  parent_id              :integer
#  user_role_id           :integer
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable
  belongs_to :company
  belongs_to :user_role
  has_many :suppliers, dependent: :destroy
  has_many :companies, through: :suppliers, dependent: :destroy

  belongs_to :parent, class_name: 'User', foreign_key: :parent_id, optional: true
  has_many :childrens, class_name: 'User', foreign_key: :parent_id

  # has_many :suppliers, dependent: :destroy
  # has_many :user_has_suppliers, through: :suppliers, foreign_key: "user_id", class_name: "Task", dependent: :destroy

  # Le bug c'est qu'un user va avoir des sous users, c'est à la company d'avoir des suppliers et non au user .

  # user has suppliers et user has companies font la meme chose, user has company aurait du s'appler supplier ?

  def has_company?(company)
    companies.where(siret: company.siret).present?
  end

  def role
    user_role
  end

  def role_slug
    role.slug
  end

  def name
    "#{first_name} #{last_name}".capitalize
  end
end
