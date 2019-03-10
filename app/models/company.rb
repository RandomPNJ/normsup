# == Schema Information
#
# Table name: companies
#
#  id                    :integer          not null, primary key
#  name                  :string
#  siret                 :string
#  invalid_at            :datetime
#  valid_at              :datetime
#  is_valid              :boolean          default(FALSE)
#  kbis                  :string
#  urssaf                :string
#  lnte                  :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  rails                 :string
#  g                     :string
#  migration             :string
#  add_fields_to_company :string
#  efetcent              :string
#  l6_declaree           :string
#  l6_normalisee         :string
#  libtefen              :string
#  iriset                :string
#  libcom                :string
#  typvoie               :string
#  dapet                 :string
#  dcren                 :string
#  l1_normalisee         :string
#  epci                  :string
#  ddebact               :string
#  categorie             :string
#  tcd                   :string
#  modet                 :string
#  libtefet              :string
#  proden                :string
#  libtu                 :string
#  siren                 :string
#  nom_dept              :string
#  defet                 :string
#  apet700               :string
#  depcomet              :string
#  section               :string
#  tu                    :string
#  libvoie               :string
#  defen                 :string
#  libapet               :string
#  depcomen              :string
#  amintret              :string
#  code_section          :string
#  l4_normalisee         :string
#  prodet                :string
#  libactivnat           :string
#  nomen_long            :string
#  codpos                :string
#  monoact               :string
#  code_classe           :string
#  l4_declaree           :string
#  amintren              :string
#  apen700               :string
#  siege                 :string
#  nic                   :string
#  tefet                 :string
#  libreg_new            :string
#  nj                    :string
#  libmonoact            :string
#  numvoie               :string
#  nicsiege              :string
#  libmodet              :string
#  libmoden              :string
#  lieuact               :string
#  diffcom               :string
#  dcret                 :string
#  du                    :string
#  coordonnees           :string
#  depet                 :string
#  code_division         :string
#  code_groupe           :string
#  datemaj               :string
#  dapen                 :string
#  l7_normalisee         :string
#  l1_declaree           :string
#  activnat              :string
#  uu                    :string
#  activite              :string
#  libnj                 :string
#  tefen                 :string
#  efencent              :string
#  rpen                  :string
#  origine               :string
#  libapen               :string
#  zemet                 :string
#  arronet               :string
#  saisonat              :string
#  rpet                  :string
#  sous_classe           :string
#  moden                 :string
#  comet                 :string
#  auxilt                :string
#  ind_publipo           :string
#  liborigine            :string
#

class Company < ApplicationRecord
  has_many :users
  has_many :suppliers
  has_many :suppliers
  has_many :interlocutors
  has_many :users, through: :suppliers
  has_many :users, through: :suppliers, as: :buyers
  before_create :initialize_company
  before_save :set_is_valid

  mount_uploader :kbis, DocumentUploader
  mount_uploader :urssaf, DocumentUploader
  mount_uploader :lnte, DocumentUploader

  def self.to_csv
    attributes = %w{id name is_valid}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      all.each do |user|
        csv << attributes.map{ |attr| user.send(attr) }
      end
    end
  end

  def initialize_company
    self.invalid_at = created_at
    self.name = nomen_long if name.blank?
  end

  def set_is_valid
    if is_valid
      unless validatable
        self.is_valid = false
        self.invalid_at = DateTime.now
      end
    else
      if validatable
        self.is_valid = true
        self.valid_at = DateTime.now
      end
    end
  end

  def validatable
    kbis.present? && urssaf.present? && lnte.present?
  end


end
