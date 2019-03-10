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

require 'test_helper'

class CompanyTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
